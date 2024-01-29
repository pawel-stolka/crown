import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@crown/material';
import { Status, Todo, compareBy, dialogConfig } from '@crown/data';
import { TodoListComponent } from '../components/todo-list/todo-list.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddTodoComponent } from '../components/dialogs/add-todo/add-todo.component';
import { filter, map, take } from 'rxjs';
import { EditTodoComponent } from '../components/dialogs/edit-todo/edit-todo.component';
import { TodoService } from '@crown/todo';

@Component({
  selector: 'crown-todo-container',
  standalone: true,
  imports: [CommonModule, TodoListComponent, MaterialModule],
  templateUrl: './todo-container.component.html',
  styleUrl: './todo-container.component.scss',
})
export class TodoContainerComponent {
  isAdmin$ = this.todoService.isAdmin$;
  all$ = this.todoService.todos$.pipe(
    map((todos) => todos.sort(compareBy('priority'))),
    map((todos) => todos.sort(compareBy('status')))
  );

  todos$ = this.all$.pipe(
    map((all) => all.filter((todo) => todo.status === Status.TO_DO)),

  );

  inProgress$ = this.all$.pipe(
    map((all) => all.filter((todo) => todo.status === Status.IN_PROGRESS))
  );

  done$ = this.all$.pipe(
    map((all) => all.filter((todo) => todo.status === Status.DONE))
  );

  closed$ = this.all$.pipe(
    map((all) => all.filter((todo) => todo.status === Status.CLOSED))
  );

  constructor(private dialog: MatDialog, private todoService: TodoService) {}

  add() {
    const dialogRef = this.dialog.open(AddTodoComponent, dialogConfig);
    this.handleDialog(dialogRef);
  }

  updateTodo(event: any) {
    this.todoService.updateStatus(event);
  }

  edit(todo: Todo) {
    dialogConfig.data = todo;
    const dialogRef = this.dialog.open(EditTodoComponent, dialogConfig);

    this.handleDialog(dialogRef);
  }

  updatePriority(todo: Todo) {
    const { id, priority } = todo;
    this.todoService.edit$(todo.id, { id, priority }).pipe(take(1)).subscribe();
  }

  private handleDialog(dialogRef: MatDialogRef<any>) {
    dialogRef
      .afterClosed()
      .pipe(filter((val) => !!val))
      .subscribe((_) => {
        // this.toast();
      });
  }
}
