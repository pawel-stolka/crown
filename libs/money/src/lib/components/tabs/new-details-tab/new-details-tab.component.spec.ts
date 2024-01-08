import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewDetailsTabComponent } from './new-details-tab.component';

describe('NewDetailsTabComponent', () => {
  let component: NewDetailsTabComponent;
  let fixture: ComponentFixture<NewDetailsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewDetailsTabComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NewDetailsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
