import { BudgetComponent } from './budget.component';
import { MonthsCategories } from '@crown/data';

describe('BudgetComponent', () => {
  let component: BudgetComponent;

  beforeEach(() => {
    component = new BudgetComponent();
    component.data = {} as MonthsCategories;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
