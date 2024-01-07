import { Route } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AdminGuard, AuthGuard } from '@crown/auth';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
  },
  // {
  //   path: 'auth',
  //   canActivate: [AuthGuard],
  //   loadChildren: () => import('@crown/auth').then((m) => m.AuthModule),
  // },
  {
    path: 'auth/login',
    loadComponent: () => import('@crown/auth').then((m) => m.LoginComponent),
  },
  {
    path: 'money',
    canActivate: [AuthGuard],
    loadChildren: () => import('@crown/money').then((m) => m.MoneyModule),
  },
  {
    path: 'todo',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('@crown/todo').then((m) => m.TodoContainerComponent),
  },
  {
    path: 'admin',
    canActivate: [AdminGuard],
    loadChildren: () => import('@crown/admin').then((m) => m.AdminModule),
  },
  {
    path: 'not-authorized',
    loadComponent: () =>
      import('@crown/auth').then((m) => m.NotAuthorizedComponent),
  },

  {
    path: '**',
    loadComponent: () => import('@crown/auth').then((m) => m.NotFoundComponent),
  },
];
