import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@crown/auth/service';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '@crown/material';
import { AppInfoComponent } from '@crown/ui';

@Component({
  selector: 'crown-navigation',
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterModule, AppInfoComponent],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
})
export class NavigationComponent {
  @Output() toggle = new EventEmitter();
  @Output() toggleMenu = new EventEmitter();

  // tokenEmail$ = this.authService.tokenEmail$;
  isLoggedIn$ = this.authService.isLoggedIn$;
  isLoggedOut$ = !this.authService.isLoggedIn$;

  constructor(private authService: AuthService, private router: Router) {}


  openRoutes() {
    this.toggleMenu.emit('left');
  }

  toggleTodos() {
    this.toggle.emit();
  }
}