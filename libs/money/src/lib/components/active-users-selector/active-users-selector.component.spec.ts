import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActiveUsersSelectorComponent } from './active-users-selector.component';

describe('ActiveUsersSelectorComponent', () => {
  let component: ActiveUsersSelectorComponent;
  let fixture: ComponentFixture<ActiveUsersSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveUsersSelectorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ActiveUsersSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
