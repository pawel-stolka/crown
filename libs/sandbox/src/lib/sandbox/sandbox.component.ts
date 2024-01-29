import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'crown-sandbox',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sandbox.component.html',
  styleUrl: './sandbox.component.scss',
})
export class SandboxComponent {
  counter = signal(0);

  increase() {
    this.counter.set(this.counter() + 1);
  }
}
