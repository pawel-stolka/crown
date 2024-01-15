import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataFilterComponent } from './data-filter.component';

describe('DataFilter3Component', () => {
  let component: DataFilterComponent;
  let fixture: ComponentFixture<DataFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DataFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
