import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { moneyRoutes } from './lib.routes';
import { MatDatepickerModule } from '@angular/material/datepicker';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(moneyRoutes),
    MatDatepickerModule,
  ],
})
export class MoneyModule {}
