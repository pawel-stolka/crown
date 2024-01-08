import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tabs2Component } from './tabs-2.component';

describe('Tabs2Component', () => {
  let component: Tabs2Component;
  let fixture: ComponentFixture<Tabs2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tabs2Component],
    }).compileComponents();

    fixture = TestBed.createComponent(Tabs2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
