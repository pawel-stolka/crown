import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditMoneyDialog } from './edit-money-dialog.component';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { MoneyService } from '../../../services/money.service';
import { AddDialogComponent } from '../add-money-dialog/add-money-dialog.component';
import { Money } from '@crown/data';

describe('EditMoneyDialog', () => {
  let component: EditMoneyDialog;
  let mockFormBuilder: jest.Mocked<FormBuilder>;
  let mockDialogRef: jest.Mocked<MatDialogRef<EditMoneyDialog>>;
  let mockMoneyService: jest.Mocked<MoneyService>;
  let mockMoney: jest.Mocked<Money>;

  beforeEach(() => {
    mockFormBuilder = new FormBuilder() as jest.Mocked<FormBuilder>;
    mockDialogRef = { close: jest.fn() } as unknown as jest.Mocked<
      MatDialogRef<EditMoneyDialog>
    >;
    mockMoneyService = {
      getCategories$: jest.fn(),
      create$: jest.fn(),
    } as unknown as jest.Mocked<MoneyService>;
    mockMoney = {} as jest.Mocked<Money>;

    mockMoneyService.getCategories$.mockReturnValue(
      of(['category1', 'category2', 'category3'])
    );

    component = new EditMoneyDialog(
      mockFormBuilder,
      mockDialogRef,
      mockMoneyService,
      mockMoney
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
