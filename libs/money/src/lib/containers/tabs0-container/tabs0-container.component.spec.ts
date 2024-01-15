import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tabs0ContainerComponent } from './tabs0-container.component';

describe('Tabs0ContainerComponent', () => {
  let component: Tabs0ContainerComponent;
  let fixture: ComponentFixture<Tabs0ContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tabs0ContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Tabs0ContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
