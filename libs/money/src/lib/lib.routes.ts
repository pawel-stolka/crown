import { Route } from '@angular/router';
import { TabsContainerComponent } from './containers/tabs-container/tabs-container.component';
import { TestTabsContainerComponent } from './containers/test-tabs-container/test-tabs-container.component';

export const moneyRoutes: Route[] = [
  { path: '', pathMatch: 'full', component: TabsContainerComponent },
  { path: 'test', pathMatch: 'full', component: TestTabsContainerComponent },
];
