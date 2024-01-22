import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonthsCategories } from '@crown/data';

@Component({
  selector: 'crown-budget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './budget.component.html',
  styleUrl: './budget.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetComponent {
  @Input() data!: MonthsCategories;
}
