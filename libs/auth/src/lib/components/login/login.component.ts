import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MaterialModule } from '@crown/material';

@Component({
  selector: 'crown-login',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  form: FormGroup;
  token$ = this.auth.token$;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService
  ) {
    this.form = this.fb.group({
      email: ['pablo', [Validators.required]],
      password: ['pablo', [Validators.required]],
    });
  }

  login() {
    const { email, password } = this.form.value;
    this.auth.login(email, password).subscribe(
      () => {
        // this.router.navigateByUrl('/money/table');
        this.router.navigateByUrl('/money'); // TODO
      },
      (err) => {
        alert('Login failed!');
      }
    );
  }
}
