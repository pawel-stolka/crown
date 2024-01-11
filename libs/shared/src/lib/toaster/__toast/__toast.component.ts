import { MaterialModule } from '@crown/material';
import { Component, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastIcon } from '@crown/data';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'crown-toast',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './__toast.component.html',
  styleUrl: './__toast.component.scss',
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [animate('300ms ease-in', style({ opacity: 1 }))]),
      transition(':leave', [animate('300ms ease-out', style({ opacity: 0 }))]),
    ]),
  ],
})
export class __ToastComponent implements OnDestroy {
  @Input() title: string = 'title';
  @Input() message: string = 'message';
  @Input() icon: string = ToastIcon.Info;
  @Input() duration: number = 5000;
  @Input() position: number = 10; // Position of the toast

  close() {
    // Logic to remove the toast from view
  }

  ngOnDestroy(): void {
    // Clean up logic if needed
  }
}
