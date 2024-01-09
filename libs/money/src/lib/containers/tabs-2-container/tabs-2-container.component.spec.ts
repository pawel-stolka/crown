import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tabs2ContainerComponent } from './tabs-2-container.component';

describe('Tabs2Component', () => {
  let component: Tabs2ContainerComponent;
  let fixture: ComponentFixture<Tabs2ContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tabs2ContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Tabs2ContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
