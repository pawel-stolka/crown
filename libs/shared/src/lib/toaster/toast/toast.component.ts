import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'crown-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
})
export class ToastComponent implements OnInit, OnDestroy {
  @Input() title: string = 'title'
  @Input() message: string = 'message'
  @Input() icon: string = 'icon'
  @Input() duration: number = 3000;

  ngOnInit(): void {
    setTimeout(() => this.close(), this.duration);
  }

  close() {
    // Logic to remove the toast from view
  }

  ngOnDestroy(): void {
    // Clean up logic if needed
  }
}
