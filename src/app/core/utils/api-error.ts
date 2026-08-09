import { HttpErrorResponse } from '@angular/common/http';

export function extractApiError(err: HttpErrorResponse): string {
  const body = err.error;

  if (body?.detail && Array.isArray(body.detail)) {
    return body.detail.map((d: { msg?: string }) => d.msg).filter(Boolean).join(' · ');
  }

  if (typeof body?.detail === 'string') {
    return body.detail;
  }

  if (typeof body?.message === 'string') {
    return body.message;
  }

  if (err.status === 0) {
    return 'Could not reach the API. Check the server and your network settings.';
  }

  return err.statusText || 'Something went wrong. Please try again.';
}
