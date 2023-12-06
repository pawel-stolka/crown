import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoService } from '../../services/todo.service';
import { Todo } from '@crown/data';
import { AddTodoComponent } from '../dialogs/add-todo/add-todo.component';
import { TodoComponent } from '../todo/todo.component';
import { MaterialModule } from '@crown/material';

@Component({
  selector: 'crown-todo-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TodoComponent, MaterialModule],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss',
})
export class TodoListComponent {
  @Input() todos: Todo[] = [];
  @Input() closed = false;
  @Output() update = new EventEmitter();

  updateTodo(event: any) {
    this.update.emit(event);
  }
}
