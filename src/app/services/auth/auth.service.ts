import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, RegisterRequest } from '../../models/auth.model';

interface CurrentUser {
  userId: string;
  email: string;
  displayName: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSignal = signal<CurrentUser | null>(null);

  currentUser = computed(() => this.currentUserSignal());
  isAuthenticated = computed(() => !!this.currentUserSignal());

  constructor(private http: HttpClient, private router: Router) {}

  signup(payload: RegisterRequest): Observable<CurrentUser> {
    return this.http
      .post<CurrentUser>(`${environment.apiUrl}/auth/register`, payload, { withCredentials: true })
      .pipe(tap(res => this.currentUserSignal.set(res)));
  }

  login(payload: LoginRequest): Observable<CurrentUser> {
    return this.http
      .post<CurrentUser>(`${environment.apiUrl}/auth/login`, payload, { withCredentials: true })
      .pipe(tap(res => this.currentUserSignal.set(res)));
  }

  logout(): void {
    this.http.post(`${environment.apiUrl}/auth/logout`, {}, { withCredentials: true }).subscribe({
      complete: () => {
        this.currentUserSignal.set(null);
        this.router.navigate(['/login']);
      }
    });
  }

  // Asks the API "is my cookie still valid?" — used by the guard on cold loads/refreshes,
  // since an HttpOnly cookie can't be read from JS to check locally.
  fetchMe(): Observable<CurrentUser | null> {
    return this.http.get<CurrentUser>(`${environment.apiUrl}/auth/me`, { withCredentials: true }).pipe(
      tap(res => this.currentUserSignal.set(res)),
      catchError(() => {
        this.currentUserSignal.set(null);
        return of(null);
      })
    );
  }
}