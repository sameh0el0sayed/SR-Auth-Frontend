export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  phone?: string | null;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RefreshRequest {
  refresh_token: string;
}

/** The API's 200 responses are typed as an open schema ({}), so we
 * accept the common shapes a JWT auth API tends to return and read
 * defensively in the auth service. */
export interface AuthTokenResponse {
  access_token?: string;
  accessToken?: string;
  token?: string;
  refresh_token?: string;
  refreshToken?: string;
  token_type?: string;
  expires_in?: number;
  user?: AuthUser;
  [key: string]: unknown;
}

export interface AuthUser {
  id?: string;
  username?: string;
  email?: string;
  phone?: string | null;
  roles?: string[];
  [key: string]: unknown;
}

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface HTTPValidationError {
  detail: ValidationError[];
}
