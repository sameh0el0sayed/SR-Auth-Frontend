import { Injectable } from '@angular/core';

const ACCESS_KEY = 'sr_access_token';
const REFRESH_KEY = 'sr_refresh_token';
const USER_KEY = 'sr_user';

@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_KEY);
  }

  setTokens(access: string | null, refresh?: string | null): void {
    if (access) {
      localStorage.setItem(ACCESS_KEY, access);
    }
    if (refresh) {
      localStorage.setItem(REFRESH_KEY, refresh);
    }
  }

  getStoredUser<T>(): T | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as T) : null;
  }

  setStoredUser(user: unknown): void {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  }

  clear(): void {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
  }
}
