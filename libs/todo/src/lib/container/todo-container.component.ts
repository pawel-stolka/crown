import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@crown/material';
import { Status, Todo, compareBy, dialogConfig } from '@crown/data';
import { TodoListComponent } from '../components/todo-list/todo-list.component';
import { TodoService } from '../services/todo.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddTodoComponent } from '../components/dialogs/add-todo/add-todo.component';
import { filter, map, take, tap } from 'rxjs';
import { EditTodoComponent } from '../components/dialogs/edit-todo/edit-todo.component';
// TODO: add alias to tsconfig
// import { compareBy } from '../../../../money/src/lib/services/money.service';

@Component({
  selector: 'crown-todo-container',
  standalone: true,
  imports: [CommonModule, TodoListComponent, MaterialModule],
  templateUrl: './todo-container.component.html',
  styleUrl: './todo-container.component.scss',
})
export class TodoContainerComponent implements OnInit {
  isAdmin$ = this.todoService.isAdmin$;
  all$ = this.todoService.todos$;

  todos$ = this.all$.pipe(
    map((all) => all.filter((todo) => todo.status === Status.TO_DO)),
    map((todos) => todos.sort(compareBy('priority')))
  );

  inProgress$ = this.all$.pipe(
    map((all) => all.filter((todo) => todo.status === Status.IN_PROGRESS)),
    map((todos) => todos.sort(compareBy('priority')))
  );

  done$ = this.all$.pipe(
    map((all) => all.filter((todo) => todo.status === Status.DONE)),
    map((todos) => todos.sort(compareBy('priority')))
  );

  closed$ = this.all$.pipe(
    map((all) => all.filter((todo) => todo.status === Status.CLOSED)),
    map((todos) => todos.sort(compareBy('priority')))
  );

  constructor(private dialog: MatDialog, private todoService: TodoService) {}

  ngOnInit(): void {}

  add() {
    const dialogRef = this.dialog.open(AddTodoComponent, dialogConfig);
    this.handleDialog(dialogRef);
  }

  updateTodo(event: any) {
    this.todoService.updateStatus(event);
  }

  editTodo(todo: Todo) {
    console.log('[editTodo]', event);
    // this.todoService.updateStatus(event);
    dialogConfig.data = todo;
    const dialogRef = this.dialog.open(EditTodoComponent, dialogConfig);

    this.handleDialog(dialogRef);
  }

  updatePriority(todo: Todo) {
    const { id, priority } = todo;
    this.todoService.edit(todo.id, { id, priority }).pipe(take(1)).subscribe();
  }

  private handleDialog(dialogRef: MatDialogRef<any>) {
    dialogRef
      .afterClosed()
      .pipe(
        filter((val) => !!val),
        tap((x) => console.log('[this.handleDialog]', x))
      )
      .subscribe((_) => {
        // this.toast();
      });
  }
}
