import { MatDialogRef } from '@angular/material/dialog';
import { MoneyService } from '../../../services/money.service';
import { DeleteDialogComponent } from './delete-money-dialog.component';
import { Money } from '@crown/data';

describe('DeleteDialogComponent', () => {
  let component: DeleteDialogComponent;
  let mockDialogRef: jest.Mocked<MatDialogRef<DeleteDialogComponent>>;
  let mockMoneyService: jest.Mocked<MoneyService>;

  beforeEach(() => {
    mockDialogRef = { close: jest.fn() } as unknown as jest.Mocked<
      MatDialogRef<DeleteDialogComponent>
    >;
    mockMoneyService = {
      delete$: jest.fn(),
    } as unknown as jest.Mocked<MoneyService>;

    component = new DeleteDialogComponent(
      mockDialogRef,
      mockMoneyService,
      {} as Money
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
