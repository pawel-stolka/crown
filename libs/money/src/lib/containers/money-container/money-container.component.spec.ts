import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MoneyContainerComponent } from './money-container.component';

describe('MoneyContainerComponent', () => {
  let component: MoneyContainerComponent;
  let fixture: ComponentFixture<MoneyContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoneyContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MoneyContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
