import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { moneyRoutes } from './lib.routes';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MY_DATE_FORMATS } from '@crown/data';
import { MatDatepickerModule } from '@angular/material/datepicker';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(moneyRoutes),
    MatDatepickerModule,
  ],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }],
})
export class MoneyModule {}
