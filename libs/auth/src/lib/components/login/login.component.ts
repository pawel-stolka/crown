import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../../shared/src/lib/services/auth/auth.service';
import { MaterialModule } from '@crown/material';
import { ToastService } from '@crown/shared';

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
  private toast = inject(ToastService)

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService
  ) {
    this.form = this.fb.group({
      email: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  login() {
    const { email, password } = this.form.value;
    this.auth.login(email, password).subscribe(
      () => {
        this.toast.showInfo('Super!', 'Witaj na pokładzie :)');
        this.router.navigateByUrl('/money'); // TODO
      },
      (err) => {
        this.toast.showError('Błąd autoryzacji', 'złe dane');
      }
    );
  }
}
