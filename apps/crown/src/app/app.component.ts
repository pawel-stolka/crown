import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavComponent } from '@crown/ui';

@Component({
  standalone: true,
  imports: [
    NavComponent, RouterModule],
  selector: 'crown-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'crown';
}
