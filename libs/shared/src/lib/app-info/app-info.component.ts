import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'crown-app-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-info.component.html',
  styleUrl: './app-info.component.scss',
})
export class AppInfoComponent {
  version = '1.2'
  build = '30.01.2024'
}
