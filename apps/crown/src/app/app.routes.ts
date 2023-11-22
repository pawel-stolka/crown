import { Route } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { authGuard } from 'libs/auth/src/lib/guards/auth.guard';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
  },
  {
    path: 'auth/login',
    loadComponent: () => import('@crown/auth').then((m) => m.LoginComponent),
  },
  {
    path: 'money',
    canActivate: [authGuard],
    loadChildren: () => import('@crown/money').then((m) => m.MoneyModule),
  },
];
