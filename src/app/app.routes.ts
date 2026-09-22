import { authGuard } from './guards/auth/auth.guard';
import { Route } from "@angular/router";

export interface RouteChild extends Route {
  title?: string;
  icon?: string;
  children?: RouteChild[];

  displayNav?: boolean;

  data?: { id: string };
}

export const routes: RouteChild[] = [
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },
  {
    path: "home",
    title: "Home",
    canActivate: [authGuard],
    children: [
      {
        path: "",
        redirectTo: "account",
        pathMatch: "full"
      },
      {
        path: "account",
        title: "Account",
        pathMatch: "full",
        loadComponent: () => import('./pages/account/account.page.component').then(m => m.AccountPageComponent),
      },
    ],
  },
  {
    path: "login",
    title: "Login",
    loadComponent: () => import('./components/login-form/login-form.component').then(m => m.LoginFormComponent),
  },
  {
    path: "signup",
    title: "Signup",
    loadComponent: () => import('./components/signup-form/signup-form.component').then(m => m.SignupFormComponent),
  },
];
