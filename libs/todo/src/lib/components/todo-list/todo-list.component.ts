import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Todo } from '@crown/data';
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
  @Output() edit = new EventEmitter();
  @Output() priority = new EventEmitter();

  updateTodo(event: any) {
    this.update.emit(event);
  }

  updatePriority(event: any) {
    this.priority.emit(event);
  }

  editTodo(event: any) {
    this.edit.emit(event);
  }
}
