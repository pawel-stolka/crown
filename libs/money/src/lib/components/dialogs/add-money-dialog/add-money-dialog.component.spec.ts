import { AddDialogComponent } from './add-money-dialog.component';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MoneyService } from '../../../services/money.service';
import { of } from 'rxjs';

describe('AddMoneyDialogComponent', () => {
  let component: AddDialogComponent;
  let mockFormBuilder: jest.Mocked<FormBuilder>;
  let mockDialogRef: jest.Mocked<MatDialogRef<AddDialogComponent>>;
  let mockMoneyService: jest.Mocked<MoneyService>;

  beforeEach(() => {
    mockFormBuilder = new FormBuilder() as jest.Mocked<FormBuilder>;
    mockDialogRef = { close: jest.fn() } as unknown as jest.Mocked<
      MatDialogRef<AddDialogComponent>
    >;
    mockMoneyService = {
      getCategories$: jest.fn(),
      create$: jest.fn(),
    } as unknown as jest.Mocked<MoneyService>;

    mockMoneyService.getCategories$.mockReturnValue(
      of(['category1', 'category2', 'category3'])
    );

    component = new AddDialogComponent(
      mockFormBuilder,
      mockDialogRef,
      mockMoneyService
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a form with default values on ngOnInit', () => {
    component.ngOnInit();
    expect(component.form).toBeDefined();
  });

  it('should create a form and initialize categories on ngOnInit', () => {
    component.ngOnInit();

    expect(component.form).toBeDefined();

    component.filteredCategories$?.subscribe((categories) => {
      expect(categories).toEqual(['category1', 'category2', 'category3']);
    });
  });

  /*
  it('should call save method and close the dialog', () => {
    component.ngOnInit();

    const createMock = jest.fn().mockReturnValue(of(null)); // Import 'of' from rxjs
    mockMoneyService.create$ = createMock;

    component.form.setValue( valid data object );
    component.save();

    expect(createMock).toHaveBeenCalledWith( expected data object );
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should close the dialog on close method call', () => {
    component.close();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });
  */
});
