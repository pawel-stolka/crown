import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@crown/material';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'libs/shared/src/lib/services/auth/auth.service';
import { ToastService } from '../toaster/service/toast.service';
import { NotificationMessage, NotificationType } from '@crown/data';

@Component({
  selector: 'crown-main-toolbar',
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterModule],
  templateUrl: './main-toolbar.component.html',
  styleUrl: './main-toolbar.component.scss',
})
export class MainToolbarComponent {
  toastService = inject(ToastService);

  tokenEmail$ = this.authService.tokenEmail$;
  isLoggedIn$ = this.authService.isLoggedIn$;
  isLoggedOut$ = this.authService.isLoggedOut$;
  @Output() toggle = new EventEmitter();
  @Output() toggleMenu = new EventEmitter();

  constructor(
    private authService: AuthService,
    private router: Router // private toastService: ToastService
  ) {}

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/auth/login');
    // this.router.navigateByUrl('');
  }

  toggleNav() {
    this.toggle.emit();
  }

  openRoutes() {
    this.toggleMenu.emit();
  }

  toast(message = 'Coś udało się zrobić, pytanie co??? :D') {
    console.log('[this.toast]', message);

    this.toastService.showToast(
      undefined,
      'Sukces',
      message,
      'icon-class',
      5000
    );
  }
  

  showSuccess(message = 'showSuccess') {
    this.toastService.showSuccess('sukces', message);
  }
  showInfo(message = 'showInfo') {
    this.toastService.showInfo('takie tam info', message);
  }
  showWarning(message = 'showWarning') {
    this.toastService.showWarning('ooo!', message);
  }
  showError(message = 'showError') {
    this.toastService.showError('źle...', message);
  }
}
