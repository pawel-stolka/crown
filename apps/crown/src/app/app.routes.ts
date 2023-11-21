import { Route } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent
  },
  {
    path: 'money',
    loadChildren: () => import('@crown/money').then((m) => m.MoneyModule),
  },
];
