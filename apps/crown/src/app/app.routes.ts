import { Route } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from '@crown/auth';

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
    canActivate: [AuthGuard],
    loadChildren: () => import('@crown/money').then((m) => m.MoneyModule),
  },
  {
    path: 'todo',
    loadComponent: () => import('@crown/todo').then((m) => m.TodoListComponent),
  },
];
