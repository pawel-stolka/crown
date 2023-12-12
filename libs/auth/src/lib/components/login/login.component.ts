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

const TEST_EMAIL = 'test@test';
const TEST_PASS = 'test';

@Component({
  selector: 'crown-login',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService
  ) {
    this.form = this.fb.group({
      email: [TEST_EMAIL, [Validators.required]],
      password: [TEST_PASS, [Validators.required]],
    });
  }

  login() {
    const { email, password } = this.form.value;
    this.auth.login(email, password).subscribe(
      () => {
        this.router.navigateByUrl('/money'); // TODO
      },
      (err) => {
        alert('Login failed!');
      }
    );
  }
}
