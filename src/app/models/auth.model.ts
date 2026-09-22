export interface User {
  id: string;
  email: string;
  displayName: string;
  role?: string;
  createdAt?: string;
}

export interface AuthResponse {
  // Present for non-browser clients; the SPA gets its session from the
  // HttpOnly cookie the backend sets alongside this body and should not
  // need to read this field directly.
  accessToken: string;
  tokenType: string;
  expiresInSeconds: number;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  displayName: string;
}