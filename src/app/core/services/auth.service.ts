import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthTokenResponse, AuthUser, LoginRequest, RefreshRequest, RegisterRequest } from '../models/auth.model';
import { TokenStorageService } from './token-storage.service';

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const part = token.split('.')[1];
    const json = atob(part.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch {
    return null;
  }
}

function deriveUserFromToken(token: string): AuthUser | null {
  const payload = decodeJwtPayload(token);
  if (!payload) return null;
  return {
    id: (payload['sub'] as string) ?? (payload['user_id'] as string),
    username: (payload['username'] as string) ?? (payload['name'] as string),
    email: payload['email'] as string,
    roles: (payload['roles'] as string[]) ?? (payload['role'] ? [payload['role'] as string] : undefined)
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly base = `${environment.apiUrl}/sr/api/auth`;
  private readonly http = inject(HttpClient);
  private readonly tokens = inject(TokenStorageService);

  private readonly _user = signal<AuthUser | null>(this.tokens.getStoredUser<AuthUser>());
  private readonly _accessToken = signal<string | null>(this.tokens.getAccessToken());

  readonly user = computed(() => this._user());
  readonly isAuthenticated = computed(() => !!this._accessToken());
  readonly initials = computed(() => {
    const u = this._user();
    const source = u?.username ?? u?.email ?? '??';
    return source
      .split(/[\s._-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join('') || '??';
  });

  register(payload: RegisterRequest): Observable<AuthTokenResponse> {
    return this.http.post<AuthTokenResponse>(`${this.base}/register`, payload);
  }

  login(payload: LoginRequest): Observable<AuthTokenResponse> {
    return this.http.post<AuthTokenResponse>(`${this.base}/login`, payload).pipe(tap((res) => this.applySession(res)));
  }

  refresh(): Observable<AuthTokenResponse> {
    const refresh_token = this.tokens.getRefreshToken() ?? '';
    const body: RefreshRequest = { refresh_token };
    return this.http.post<AuthTokenResponse>(`${this.base}/refresh`, body).pipe(tap((res) => this.applySession(res)));
  }

  logout(): void {
    this.tokens.clear();
    this._accessToken.set(null);
    this._user.set(null);
  }

  getAccessToken(): string | null {
    return this._accessToken();
  }

  getRefreshToken(): string | null {
    return this.tokens.getRefreshToken();
  }

  /** Normalizes the API's loosely-typed 200 response into stored tokens + user. */
  private applySession(res: AuthTokenResponse): void {
    const access = res.access_token ?? res.accessToken ?? res.token ?? null;
    const refresh = res.refresh_token ?? res.refreshToken ?? null;
    if (access) {
      this.tokens.setTokens(access, refresh);
      this._accessToken.set(access);
      const user = res.user ?? deriveUserFromToken(access) ?? undefined;
      if (user) {
        this.tokens.setStoredUser(user);
        this._user.set(user);
      }
    }
  }
}
