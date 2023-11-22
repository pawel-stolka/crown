import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from "@crown/material";
import { Router, RouterModule } from '@angular/router';
import { AuthService } from "libs/auth/src/lib/services/auth.service";

@Component({
  selector: 'crown-nav',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent {
  user$ = this.auth.user$;
  isLoggedIn$ = this.auth.isLoggedIn$;
  isLoggedOut$ = this.auth.isLoggedOut$;

  constructor(private auth: AuthService, private router: Router) {}

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/auth/login');
  }
}
