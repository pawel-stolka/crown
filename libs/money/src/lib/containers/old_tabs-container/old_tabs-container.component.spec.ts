import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Old__TabsContainerComponent } from './old_tabs-container.component';

describe('TabsContainerComponent', () => {
  let component: Old__TabsContainerComponent;
  let fixture: ComponentFixture<Old__TabsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Old__TabsContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Old__TabsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
