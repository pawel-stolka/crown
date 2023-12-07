import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TodoService } from '../../../services/todo.service';
import { MatDialogRef } from '@angular/material/dialog';
import { AUTH_TOKEN_EMAIL, Status, Todo } from '@crown/data';
import { MaterialModule } from '@crown/material';

@Component({
  selector: 'crown-add-todo',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './add-todo.component.html',
  styleUrl: './add-todo.component.scss',
})
export class AddTodoComponent {
  title = 'Dodaj do poprawy...';
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddTodoComponent>,
    private todoService: TodoService,
  ) {
    const currentUser = localStorage.getItem(AUTH_TOKEN_EMAIL) ?? null;
    console.log('[currentUser]', currentUser);

    const email: string | null = currentUser
      ? JSON.parse(currentUser).email
      : null;

    this.form = this.fb.group({
      userId: [email],
      title: ['', [Validators.required]],
      description: [null, [Validators.required]],
      status: [Status.TO_DO, [Validators.required]],
    });
  }

  save() {
    const changes: Partial<Todo> = this.form.value;

    this.todoService
      .create(changes)
      .subscribe(() => {
        this.dialogRef.close()
        // this.toast('Dodałeś rachunek...')
      });
  }

  close() {
    this.dialogRef.close();
  }
}
