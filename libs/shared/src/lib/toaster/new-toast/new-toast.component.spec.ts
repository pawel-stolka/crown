import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewToastComponent } from './new-toast.component';

describe('NewToastComponent', () => {
  let component: NewToastComponent;
  let fixture: ComponentFixture<NewToastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewToastComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NewToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
