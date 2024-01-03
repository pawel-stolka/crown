import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@crown/material';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@crown/auth/service';

@Component({
  selector: 'crown-nav',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent {
  tokenEmail$ = this.authService.tokenEmail$;
  isLoggedIn$ = this.authService.isLoggedIn$;
  isLoggedOut$ = this.authService.isLoggedOut$;
  @Output() toggle = new EventEmitter();
  @Output() toggleMenu = new EventEmitter();

  splineColor = '#ffc83d';
  splineBackground = '#3f51b5';

  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/auth/login');
    // this.router.navigateByUrl('');
  }

  toggleNav() {
    this.toggle.emit('try');
  }

  openRoutes() {
    this.toggleMenu.emit('left');

  }
}
