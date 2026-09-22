import { Injectable, Signal, WritableSignal, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { Router } from '@angular/router';
import { AuthResponse, LoginCredentials, SignupCredentials, User } from '../../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly API_URL = 'http://localhost:8080/api/v1';

  private currentUserSignal: WritableSignal<User | null> = signal<User | null>(null);

  readonly currentUser: Signal<User | null> = this.currentUserSignal.asReadonly();
  readonly isAuthenticated: Signal<boolean> = computed(() => !!this.currentUserSignal());

  // Removed fetchMe() call from constructor to let authGuard control route hydration

  signup(credentials: SignupCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.API_URL}/auth/register`,
      credentials,
      { withCredentials: true }
    ).pipe(
      tap((res) => {
        if (res.user) {
          this.currentUserSignal.set(res.user);
        }
      })
    );
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.API_URL}/auth/login`,
      credentials,
      { withCredentials: true }
    ).pipe(
      tap((res) => {
        if (res.user) {
          this.currentUserSignal.set(res.user);
        }
      })
    );
  }

  fetchMe(): Observable<User | null> {
    return this.http.get<User>(
      `${this.API_URL}/auth/me`,
      { withCredentials: true }
    ).pipe(
      tap((user) => this.currentUserSignal.set(user)),
      catchError(() => {
        this.currentUserSignal.set(null);
        return of(null);
      })
    );
  }

  logout(): void {
    this.http.post(`${this.API_URL}/auth/logout`, {}, { withCredentials: true }).pipe(
      catchError(() => of(null))
    ).subscribe(() => {
      this.currentUserSignal.set(null);
      this.router.navigate(['/login']);
    });
  }
}