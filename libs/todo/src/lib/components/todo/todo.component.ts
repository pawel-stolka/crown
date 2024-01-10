import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Status,
  Todo,
  StatusChange,
  Priority,
  SHOW_PRIORITY,
  EMPTY_STRING,
} from '@crown/data';
import { MaterialModule } from '@crown/material';
import { TodoPriorityComponent } from '../todo-priority/todo-priority.component';

@Component({
  selector: 'crown-todo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MaterialModule, TodoPriorityComponent],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss',
})
export class TodoComponent {
  @Input() todo!: Todo;
  @Input() closed = false;
  @Output() status = new EventEmitter();
  @Output() priority = new EventEmitter();
  @Output() editting = new EventEmitter();

  Status = Status;

  getIconName(status: string): string {
    switch (status) {
      case Status.DONE:
        return 'done_outline';
      case Status.IN_PROGRESS:
        return 'hourglass_empty';
      case Status.TO_DO:
        return 'priority_high'; // Replace 'todo_icon' with the actual icon name for 'TODO'
      default:
        return 'priority_high';
    }
  }

  edit() {
    this.editting.emit(this.todo);
  }

  showPriority = (priority: Priority | undefined) => SHOW_PRIORITY(priority);

  getPriorityIcon(priority: Priority | undefined): string {
    switch (priority) {
      case Priority.URGENT:
        return 'error';
      case Priority.HIGH:
        return 'error_outline';
      case Priority.MEDIUM:
        return 'warning';
      case Priority.LOW:
        return 'bug_report';
      case Priority.WHO_CARES:
        return 'info';
      default:
        return EMPTY_STRING;
    }
  }

  getClass(priority: Priority | undefined) {
    switch (priority) {
      case Priority.URGENT:
        return 'priority-critical t-center';
      case Priority.HIGH:
        return 'priority-high t-center';

      case Priority.MEDIUM:
        return 'priority-medium t-center';

      case Priority.LOW:
        return 'priority-low t-center';
      case Priority.WHO_CARES:
        return 'priority-very-low t-center';

      default:
        return 'priority-unknown t-center';
        return 'priority-minor';
    }
  }

  // onPriorityChange(priority: number) {
  //   const { id } = this.todo;
  //   console.log('[this.onPriorityChange]', priority);
  //   this.priority.emit({ id, priority });
  // }

  upgrade() {
    const { id } = this.todo;
    this.status.emit({ id, action: StatusChange.UPGRADE });
  }

  downgrade() {
    const { id } = this.todo;
    this.status.emit({ id, action: StatusChange.DOWNGRADE });
  }
}
