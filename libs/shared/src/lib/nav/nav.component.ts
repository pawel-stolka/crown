import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@crown/material';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'libs/auth/src/lib/services/auth.service';

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

  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/auth/login');
  }
}
