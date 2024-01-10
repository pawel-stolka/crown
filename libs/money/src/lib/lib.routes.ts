import { Route } from '@angular/router';
import { Old__TabsContainerComponent } from './containers/old_tabs-container/old_tabs-container.component';
import { TabsContainerComponent } from './containers/tabs-container/tabs-container.component';

export const moneyRoutes: Route[] = [
  { path: ':2', pathMatch: 'full', component: Old__TabsContainerComponent },
  { path: '', pathMatch: 'full', component: TabsContainerComponent },
];
