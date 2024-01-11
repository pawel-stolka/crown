import { ComponentFixture, TestBed } from '@angular/core/testing';
import { __ToastComponent as __ToastComponent } from './__toast.component';

describe('__ToastComponent', () => {
  let component: __ToastComponent;
  let fixture: ComponentFixture<__ToastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [__ToastComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(__ToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
