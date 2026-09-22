export interface User {
  id: string;
  email: string;
  displayName: string;
  role?: string;
  createdAt?: string;
}

export interface RegisterRequest {
  email: string;
  displayName: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  expiresAt: string;
  userId: string;
  email: string;
  displayName: string;
}