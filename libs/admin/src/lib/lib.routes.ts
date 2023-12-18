import { Route } from '@angular/router';
import { DashboardComponent } from './container/dashboard/dashboard.component';

export const adminRoutes: Route[] = [
  { path: '', pathMatch: 'full', component: DashboardComponent },
];
