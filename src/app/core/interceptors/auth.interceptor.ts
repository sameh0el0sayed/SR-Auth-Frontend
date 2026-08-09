import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

let isRefreshing = false;
const refreshedToken$ = new BehaviorSubject<string | null>(null);

const AUTH_FREE_PATHS = ['/sr/api/auth/login', '/sr/api/auth/register', '/sr/api/auth/refresh'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const isAuthFree = AUTH_FREE_PATHS.some((p) => req.url.includes(p));
  const token = auth.getAccessToken();
  const authedReq = token && !isAuthFree ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(authedReq).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401 && !isAuthFree && auth.getRefreshToken()) {
        return handle401(req, next, auth, router);
      }
      return throwError(() => error);
    })
  );
};

function handle401(req: Parameters<HttpInterceptorFn>[0], next: Parameters<HttpInterceptorFn>[1], auth: AuthService, router: Router) {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshedToken$.next(null);

    return auth.refresh().pipe(
      switchMap((res) => {
        isRefreshing = false;
        const newToken = auth.getAccessToken();
        refreshedToken$.next(newToken);
        const retried = newToken ? req.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } }) : req;
        return next(retried);
      }),
      catchError((refreshError) => {
        isRefreshing = false;
        auth.logout();
        router.navigate(['/login']);
        return throwError(() => refreshError);
      })
    );
  }

  return refreshedToken$.pipe(
    filter((t) => t !== null),
    take(1),
    switchMap((newToken) => {
      const retried = newToken ? req.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } }) : req;
      return next(retried);
    })
  );
}
