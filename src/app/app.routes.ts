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
    path: "boards",
    title: "Boards",
    canActivate: [authGuard],
    children: [
      {
        path: "",
        pathMatch: "full",
        loadComponent: () => import('./pages/boards/boards.component').then(m => m.BoardsPageComponent),
      },
      {
        path: ":boardId",
        pathMatch: "full",
        loadComponent: () => import('./components/board/board.component').then(m => m.BoardComponent),
      },
      {
        path: ":boardId/tickets/:ticketId",
        loadComponent: () => import('./pages/ticket/ticket.component').then(m => m.TicketPageComponent),
      },
    ],
  },
  {
    path: "login",
    title: "Login",
    data: { id: "login" },
    loadComponent: () => import('./pages/auth/auth.page.component').then(m => m.AuthPageComponent),
  },
  {
    path: "signup",
    title: "Signup",
    data: { id: "signup" },
    loadComponent: () => import('./pages/auth/auth.page.component').then(m => m.AuthPageComponent),
  },
];