import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MaterialModule } from '@crown/material';
import { ToastIcon } from '@crown/data';

@Component({
  selector: 'crown-new-toast',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './new-toast.component.html',
  styleUrl: './new-toast.component.scss',
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [animate('500ms ease-in', style({ opacity: 1 }))]),
      transition(':leave', [animate('500ms ease-out', style({ opacity: 0 }))])
    ])
  ]
})
export class NewToastComponent {
  @Input() title: string = 'title'
  @Input() message: string = 'message'
  @Input() icon: string = ToastIcon.Info;
  @Input() duration: number = 3000;
  @Input() position: number = 10; // Position of the toast

  close() {
    // Logic to remove the toast from view
  }

  ngOnDestroy(): void {
    // Clean up logic if needed
  }
}
