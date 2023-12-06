import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@crown/material';
import { Status, Todo, dialogConfig } from '@crown/data';
import { TodoListComponent } from '../components/todo-list/todo-list.component';
import { TodoService } from '../services/todo.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddTodoComponent } from '../components/dialogs/add-todo/add-todo.component';
import { filter, tap } from 'rxjs';

@Component({
  selector: 'crown-todo-container',
  standalone: true,
  imports: [CommonModule, TodoListComponent, MaterialModule],
  templateUrl: './todo-container.component.html',
  styleUrl: './todo-container.component.scss',
})
export class TodoContainerComponent implements OnInit {
  todos$ = this.todoService.todos$;

  constructor(private dialog: MatDialog, private todoService: TodoService) {}

  ngOnInit(): void {}

  updateTodo(event: any) {
    console.log('[updateTodo]', event);
    this.todoService.updateStatus(event)
  }

  add() {
    const dialogRef = this.dialog.open(AddTodoComponent, dialogConfig);

    this.handleDialog(dialogRef);
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
