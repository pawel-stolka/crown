import { Route } from '@angular/router';
import { SimpleListComponent } from './containers/simple-list/simple-list.component';
import { TabsContainerComponent } from './containers/tabs-container/tabs-container.component';
import { Tabs2Component } from './containers/tabs-2/tabs-2.component';

export const moneyRoutes: Route[] = [
  // { path: '', pathMatch: 'full', component: SimpleListComponent },
  { path: '', pathMatch: 'full', component: TabsContainerComponent },
  { path: ':2', pathMatch: 'full', component: Tabs2Component },
  // {
  //   path: 'money',
  //   loadChildren: () => import('@crown/money').then((m) => m.MoneyModule),
  // },
];
