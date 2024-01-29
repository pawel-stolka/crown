import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditMoneyDialog } from './edit-money-dialog.component';

describe('EditMoneyDialog', () => {
  let component: EditMoneyDialog;
  let fixture: ComponentFixture<EditMoneyDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditMoneyDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(EditMoneyDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
