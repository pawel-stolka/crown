import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoListComponent } from '../components/todo-list/todo-list.component';

@Component({
  selector: 'crown-todo-container',
  standalone: true,
  imports: [CommonModule, TodoListComponent],
  templateUrl: './todo-container.component.html',
  styleUrl: './todo-container.component.scss',
})
export class TodoContainerComponent {}
