import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoService } from '../../services/todo.service';
import { Todo } from '@crown/data';
import { AddTodoComponent } from '../dialogs/add-todo/add-todo.component';
import { TodoComponent } from '../todo/todo.component';

@Component({
  selector: 'crown-todo-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TodoComponent],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss',
})
export class TodoListComponent {
  @Input() todos: Todo[] = [];
  @Output() update = new EventEmitter();

  updateTodo(event: any) {
    this.update.emit(event);
  }
}
