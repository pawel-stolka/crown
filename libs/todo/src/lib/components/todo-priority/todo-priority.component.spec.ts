import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoPriorityComponent } from './todo-priority.component';

describe('TodoPriorityComponent', () => {
  let component: TodoPriorityComponent;
  let fixture: ComponentFixture<TodoPriorityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoPriorityComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoPriorityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
