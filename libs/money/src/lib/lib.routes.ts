import { Route } from '@angular/router';
import { SimpleListComponent } from './containers/simple-list/simple-list.component';
import { TabsContainerComponent } from './containers/tabs-container/tabs-container.component';
import { Tabs2ContainerComponent } from './containers/tabs-2-container/tabs-2-container.component';

export const moneyRoutes: Route[] = [
  // { path: '', pathMatch: 'full', component: SimpleListComponent },
  { path: '', pathMatch: 'full', component: TabsContainerComponent },
  { path: ':2', pathMatch: 'full', component: Tabs2ContainerComponent },
  // {
  //   path: 'money',
  //   loadChildren: () => import('@crown/money').then((m) => m.MoneyModule),
  // },
];
