import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';
import { NavComponent } from '@crown/ui';

@Component({
  standalone: true,
  imports: [NxWelcomeComponent, NavComponent, RouterModule],
  selector: 'crown-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'crown';
}
