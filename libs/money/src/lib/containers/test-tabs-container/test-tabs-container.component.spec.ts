import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestTabsContainerComponent } from './test-tabs-container.component';

describe('TestTabsContainerComponent', () => {
  let component: TestTabsContainerComponent;
  let fixture: ComponentFixture<TestTabsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestTabsContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestTabsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
