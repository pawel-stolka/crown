import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import {
  AUTH_TOKEN_EMAIL,
  EMPTY_STRING,
  PRIORITIES,
  Priority,
  SHOW_PRIORITY,
  Status,
  Todo,
} from '@crown/data';
import { MaterialModule } from '@crown/material';
import { TodoService } from '@crown/todo';

@Component({
  selector: 'crown-add-todo',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './add-todo.component.html',
  styleUrl: './add-todo.component.scss',
})
export class AddTodoComponent {
  title = 'Zgłoś błąd';
  form: FormGroup;

  priorities = PRIORITIES;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddTodoComponent>,
    private todoService: TodoService
  ) {
    const currentUser = localStorage.getItem(AUTH_TOKEN_EMAIL) ?? null;
    const email: string | null = currentUser
      ? JSON.parse(currentUser).email
      : null;

    this.form = this.fb.group({
      userId: [email],
      title: [EMPTY_STRING, [Validators.required]],
      description: [null, [Validators.required]],
      status: [Status.TO_DO, [Validators.required]],
      priority: [null, [Validators.required]],
    });
  }

  showPriority = (priority: Priority | undefined) => SHOW_PRIORITY(priority);

  save() {
    const changes: Partial<Todo> = this.form.value;

    this.todoService.create$(changes).subscribe(() => {
      this.dialogRef.close();
    });
  }

  close() {
    this.dialogRef.close();
  }
}
