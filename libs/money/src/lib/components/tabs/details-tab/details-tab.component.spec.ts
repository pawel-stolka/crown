import { DetailsTabComponent } from './details-tab.component';
import { MatDialog } from '@angular/material/dialog';
import { Money } from '@crown/data';
import { MatDialogMock } from '../../../containers/money-container/money-container.component.spec';

describe('DetailsTabComponent', () => {
  let component: DetailsTabComponent;
  let mockMatDialog: MatDialog;

  beforeEach(() => {
    mockMatDialog = new MatDialogMock() as any;
    component = new DetailsTabComponent(
      mockMatDialog,
      'pl-PL'
    );
    component.money = [] as Money[];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
