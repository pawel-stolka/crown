import { Route } from '@angular/router';
import { MoneyContainerComponent } from './containers/money-container/money-container.component';

export const moneyRoutes: Route[] = [
  { path: '', pathMatch: 'full', component: MoneyContainerComponent },
];
