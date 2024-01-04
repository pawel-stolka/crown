import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@crown/material';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@crown/auth/service';

@Component({
  selector: 'crown-main-toolbar',
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterModule, ],
  templateUrl: './main-toolbar.component.html',
  styleUrl: './main-toolbar.component.scss',
})
export class MainToolbarComponent {
  tokenEmail$ = this.authService.tokenEmail$;
  isLoggedIn$ = this.authService.isLoggedIn$;
  isLoggedOut$ = this.authService.isLoggedOut$;
  @Output() toggle = new EventEmitter();
  @Output() toggleMenu = new EventEmitter();

  constructor(private authService: AuthService, private router: Router) {}

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
