import { Component, inject, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { AuthService } from '../../services/auth/auth.service';
import { FieldConfig, FieldList } from '../../components/field-list/field-list';
import { FormsModule } from '@angular/forms';

type AuthMode = 'login' | 'signup';

interface AuthFormConfig {
  title: string;
  subtitle: string;
  submitLabel: string;
  fields: FieldConfig[];
  footerText: string;
  footerLinkText: string;
  footerRoute: string;
}

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [CardModule, FormsModule, ButtonModule, MessageModule, RouterLink, FieldList],
  templateUrl: './auth.page.component.html'
})
export class AuthPageComponent {
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private router = inject(Router);

  @ViewChild(FieldList) private fieldList?: FieldList;

  mode: AuthMode = (this.route.snapshot.data['id'] as AuthMode) ?? 'login';
  config = this.getConfig(this.mode);

  model: Record<string, any> =
    this.mode === 'login'
      ? { email: '', password: '' }
      : { displayName: '', email: '', password: '' };

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  onSubmit(): void {
    this.fieldList?.markAllTouched();
    if (this.fieldList && !this.fieldList.valid()) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const request$ =
      this.mode === 'login'
        ? this.authService.login(this.model as any)
        : this.authService.signup(this.model as any);

    request$.subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err?.error?.message || err?.error?.errors?.join(', ') || 'Something went wrong.');
      }
    });
  }

  private getConfig(mode: AuthMode): AuthFormConfig {
    if (mode === 'login') {
      return {
        title: 'Welcome Back',
        subtitle: 'Sign in to your account',
        submitLabel: 'Sign In',
        footerText: "Don't have an account?",
        footerLinkText: 'Sign up',
        footerRoute: '/signup',
        fields: [
          {
            path: 'email',
            label: 'Email',
            kind: 'text',
            inputType: 'email',
            validators: [
              { type: 'required', message: 'Email is required.' },
              { type: 'email', message: 'Enter a valid email.' }
            ]
          },
          {
            path: 'password',
            label: 'Password',
            kind: 'text',
            inputType: 'password',
            validators: [
              { type: 'required', message: 'Password is required.' },
              { type: 'minLength', value: 6, message: 'Password must be at least 6 characters.' }
            ]
          }
        ]
      };
    }

    return {
      title: 'Create an Account',
      subtitle: 'Sign up to get started',
      submitLabel: 'Sign Up',
      footerText: 'Already have an account?',
      footerLinkText: 'Sign in',
      footerRoute: '/login',
      fields: [
        {
          path: 'displayName',
          label: 'Display Name',
          kind: 'text',
          validators: [{ type: 'required', message: 'Display name is required.' }]
        },
        {
          path: 'email',
          label: 'Email',
          kind: 'text',
          inputType: 'email',
          validators: [
            { type: 'required', message: 'Email is required.' },
            { type: 'email', message: 'Enter a valid email.' }
          ]
        },
        {
          path: 'password',
          label: 'Password',
          kind: 'text',
          inputType: 'password',
          validators: [
            { type: 'required', message: 'Password is required.' },
            { type: 'minLength', value: 6, message: 'Password must be at least 6 characters.' }
          ]
        }
      ]
    };
  }
}