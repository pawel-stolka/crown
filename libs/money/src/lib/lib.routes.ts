import { Route } from '@angular/router';
import { SimpleListComponent } from './containers/simple-list/simple-list.component';
import { TabsContainerComponent } from './containers/tabs-container/tabs-container.component';

export const moneyRoutes: Route[] = [
  // { path: '', pathMatch: 'full', component: SimpleListComponent },
  { path: '', pathMatch: 'full', component: TabsContainerComponent },
  // {
  //   path: 'money',
  //   loadChildren: () => import('@crown/money').then((m) => m.MoneyModule),
  // },
];
