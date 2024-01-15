import { Route } from '@angular/router';
// import { TabsContainerComponent } from './containers/__tabs-container/tabs-container.component';
import { TestTabsContainerComponent } from './containers/test-tabs-container/test-tabs-container.component';
import { MoneyContainerComponent } from './containers/money-container/money-container.component';

export const moneyRoutes: Route[] = [
  // { path: '1', pathMatch: 'full', component: TabsContainerComponent },
  { path: '', pathMatch: 'full', component: MoneyContainerComponent },
  // { path: 'test', pathMatch: 'full', component: TestTabsContainerComponent },
];
