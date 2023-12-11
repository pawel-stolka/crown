import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { PRIORITIES, Priority, SHOW_PRIORITY } from '@crown/data';

@Component({
  selector: 'crown-todo-priority',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './todo-priority.component.html',
  styleUrl: './todo-priority.component.scss',
})
export class TodoPriorityComponent {
  @Input() priority!: Priority;// | undefined;// Priority.UNDEFINED;
  @Output() selectionChange = new EventEmitter();

  onSelectionChange(event: any) {
    console.log('[onSelectionChange]', event.value);

    this.selectionChange.emit(event.value)
  }
  priorities = PRIORITIES
  showPriorities = (priority: Priority) => SHOW_PRIORITY(priority);

  showPriority = SHOW_PRIORITY(this.priority)
}
