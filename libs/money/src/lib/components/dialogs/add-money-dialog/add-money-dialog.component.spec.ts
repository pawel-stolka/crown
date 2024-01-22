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
    // Mock FormBuilder, MatDialogRef, and MoneyService
    mockFormBuilder = new FormBuilder() as jest.Mocked<FormBuilder>;
    mockDialogRef = { close: jest.fn() } as unknown as jest.Mocked<
      MatDialogRef<AddDialogComponent>
    >;
    mockMoneyService = {
      getCategories$: jest.fn(),
      create$: jest.fn(),
    } as unknown as jest.Mocked<MoneyService>;

    // Mock the getCategories$ method to return an observable of categories
    mockMoneyService.getCategories$.mockReturnValue(
      of(['category1', 'category2', 'category3'])
    );

    // Create an instance of the component
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
    // Initialize component
    component.ngOnInit();

    // Test that form is created with expected default values and validators
    expect(component.form).toBeDefined();
    // More expectations here for form fields and their validators
  });

  it('should create a form and initialize categories on ngOnInit', () => {
    // Initialize component
    component.ngOnInit();

    // Test that form is created
    expect(component.form).toBeDefined();

    // Test that categories are initialized correctly
    component.filteredCategories$?.subscribe(categories => {
      expect(categories).toEqual(['category1', 'category2', 'category3']);
    });
  });

  /*
  it('should call save method and close the dialog', () => {
    // Initialize component
    component.ngOnInit();

    // Mock the service call
    const createMock = jest.fn().mockReturnValue(of(null)); // Import 'of' from rxjs
    mockMoneyService.create$ = createMock;

    // Set valid form values and call save
    component.form.setValue( valid data object );
    component.save();

    // Expectations
    expect(createMock).toHaveBeenCalledWith( expected data object );
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should close the dialog on close method call', () => {
    component.close();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });
  */
});
