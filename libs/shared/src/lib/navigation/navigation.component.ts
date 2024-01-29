import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'libs/shared/src/lib/services/auth/auth.service';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@crown/material';
import { AppInfoComponent } from '@crown/shared';

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

  isLoggedIn$ = this.authService.isLoggedIn$;
  isLoggedOut$ = !this.authService.isLoggedIn$;

  constructor(private authService: AuthService) {}

  toggleNav() {
    this.toggleMenu.emit('left');
  }

  toggleTodos() {
    this.toggle.emit();
  }
}
