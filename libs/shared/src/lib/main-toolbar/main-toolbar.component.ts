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
  private authService = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  tokenEmail$ = this.authService.tokenEmail$;
  isLoggedIn$ = this.authService.isLoggedIn$;
  isLoggedOut$ = this.authService.isLoggedOut$;
  @Output() toggle = new EventEmitter();
  @Output() toggleMenu = new EventEmitter();

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
}
