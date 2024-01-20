import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DoughnutDemoComponent } from './doughnut-demo.component';

describe('DoughnutDemoComponent', () => {
  let component: DoughnutDemoComponent;
  let fixture: ComponentFixture<DoughnutDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoughnutDemoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DoughnutDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
