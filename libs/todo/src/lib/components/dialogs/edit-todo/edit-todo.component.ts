import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AUTH_TOKEN_EMAIL, Todo } from '@crown/data';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TodoService } from '../../../services/todo.service';
import { MaterialModule } from '@crown/material';

@Component({
  selector: 'crown-edit-todo',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './edit-todo.component.html',
  styleUrl: './edit-todo.component.scss',
})
export class EditTodoComponent {
  title = 'Zmień zadanie';
  form: FormGroup;
  todo: Todo;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditTodoComponent>,
    private todoService: TodoService,
    @Inject(MAT_DIALOG_DATA) todo: Todo
  ) {
    this.todo = todo;

    const { userId, title, description, status, priority, createdAt } = todo;

    const currentUser = localStorage.getItem(AUTH_TOKEN_EMAIL) ?? null;
    const email: string | null = currentUser
      ? JSON.parse(currentUser).email
      : null;

    const user = userId ?? email;

    this.form = this.fb.group({
      userId: [user, Validators.required],
      title: [title, Validators.required],
      description: [description, Validators.required],
      status: [status ?? '', Validators.required],
      priority: [priority ?? 0], //, Validators.min(0), Validators.max(5)],
      createdAt: [createdAt],
    });
  }

  save() {
    const changes: Partial<Todo> = this.form.value;
    console.log('save changes', changes);

    this.todoService.edit(this.todo.id, changes).subscribe((res) => {
      this.dialogRef.close(res);
    });
  }

  close() {
    this.dialogRef.close();
  }
}