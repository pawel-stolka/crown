import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@crown/material';
import { Status, Todo, dialogConfig } from '@crown/data';
import { TodoListComponent } from '../components/todo-list/todo-list.component';
import { TodoService } from '../services/todo.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddTodoComponent } from '../components/dialogs/add-todo/add-todo.component';
import { filter, map, take, tap } from 'rxjs';
import { EditTodoComponent } from '../components/dialogs/edit-todo/edit-todo.component';
// TODO: add alias to tsconfig
import { compareBy } from '../../../../money/src/lib/services/money.service';

@Component({
  selector: 'crown-todo-container',
  standalone: true,
  imports: [CommonModule, TodoListComponent, MaterialModule],
  templateUrl: './todo-container.component.html',
  styleUrl: './todo-container.component.scss',
})
export class TodoContainerComponent implements OnInit {
  all$ = this.todoService.todos$;

  todos$ = this.all$.pipe(
    map((all) => all.filter((todo) => todo.status === Status.TO_DO)),
    map((todos) => todos.sort(compareBy('priority')))
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

  ngOnInit(): void {}

  add() {
    const dialogRef = this.dialog.open(AddTodoComponent, dialogConfig);

    this.handleDialog(dialogRef);
  }

  updateTodo(event: any) {
    console.log('[updateTodo]', event);
    this.todoService.updateStatus(event);
  }

  editTodo(todo: Todo) {
    console.log('[editTodo]', event);
    // this.todoService.updateStatus(event);
    dialogConfig.data = todo;
    const dialogRef = this.dialog.open(EditTodoComponent, dialogConfig);

    // this.handleDialog(dialogRef);
    dialogRef
      .afterClosed()
      .pipe(
        tap((x) => console.log('[this.edit]', x)),
        // tap((_) => this.showInfo()),
        filter((val) => !!val)
      )
      .subscribe((_) => {
        console.log('[this.edit sub]', _);
      });
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
        console.log('[this.handleDialog]', _);
        // this.toast();
      });
  }
}
