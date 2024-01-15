import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataFilter3Component } from './data-filter.component';

describe('DataFilter3Component', () => {
  let component: DataFilter3Component;
  let fixture: ComponentFixture<DataFilter3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataFilter3Component],
    }).compileComponents();

    fixture = TestBed.createComponent(DataFilter3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
