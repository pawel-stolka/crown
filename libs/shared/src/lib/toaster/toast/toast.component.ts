import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@crown/material';
import { trigger, state, style, transition, animate } from '@angular/animations';

export enum Icon {
  Info = 'info',
  Success = 'check',
  Error = 'error',
  Warning ='warning',
  High = 'priority_high'
}
@Component({
  selector: 'crown-toast',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [animate('300ms ease-in', style({ opacity: 1 }))]),
      transition(':leave', [animate('300ms ease-out', style({ opacity: 0 }))])
    ])
  ]
})
export class ToastComponent implements OnInit, OnDestroy {
  @Input() title: string = 'title'
  @Input() message: string = 'message'
  @Input() icon: string = Icon.Info;
  @Input() duration: number = 3000;
  @Input() position: number = 10; // Position of the toast

  ngOnInit(): void {
    // setTimeout(() => this.close(), this.duration);
  }

  close() {
    // Logic to remove the toast from view
  }

  ngOnDestroy(): void {
    // Clean up logic if needed
  }
}
