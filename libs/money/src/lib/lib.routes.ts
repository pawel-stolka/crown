import { Route } from '@angular/router';
import { TabsContainerComponent } from './containers/tabs-container/tabs-container.component';

export const moneyRoutes: Route[] = [
  { path: '', pathMatch: 'full', component: TabsContainerComponent },
];
