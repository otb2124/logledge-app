import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { AuthService } from '../../services/auth/auth.service';
import { FieldConfig, FieldList } from '../field-list/field-list';

interface LoginModel {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [RouterLink, CardModule, ButtonModule, MessageModule, FieldList],
  templateUrl: './login-form.component.html'
})
export class LoginFormComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  model: LoginModel = { email: '', password: '' };

  fields: FieldConfig[] = [
    { path: 'email', label: 'Email', kind: 'text', inputType: 'email' },
    { path: 'password', label: 'Password', kind: 'text', inputType: 'password' }
  ];

  private get isValid(): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.model.email) && this.model.password.length >= 6;
  }

  onSubmit(): void {
    if (!this.isValid) {
      this.errorMessage.set('Enter a valid email and a password of at least 6 characters.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.login(this.model).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err?.error?.message || 'Invalid credentials or server error.');
      }
    });
  }
}