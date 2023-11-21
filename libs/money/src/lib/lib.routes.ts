import { Route } from '@angular/router';
import { SimpleListComponent } from './containers/simple-list/simple-list.component';

export const moneyRoutes: Route[] = [
  { path: '', pathMatch: 'full', component: SimpleListComponent },
  // {
  //   path: 'money',
  //   loadChildren: () => import('@crown/money').then((m) => m.MoneyModule),
  // },
];
