import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonthsCategories, PriceByTypePipe, SumByMonthPipe } from '@crown/data';
import { DoughnutComponent } from '../../doughnut/doughnut.component';
import { BudgetComponent } from '../../budget/budget.component';

@Component({
  selector: 'crown-groups-tab',
  standalone: true,
  imports: [
    CommonModule,
    SumByMonthPipe,
    PriceByTypePipe,
    DoughnutComponent,
    BudgetComponent,
  ],
  templateUrl: './groups-tab.component.html',
  styleUrl: './groups-tab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupsTabComponent {
  @Input() data: MonthsCategories | null | undefined; // = {} as MonthsCategories;
}
