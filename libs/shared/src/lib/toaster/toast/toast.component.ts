import { Component, ElementRef, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { MaterialModule } from '@crown/material';
import { NotificationType, ToastIcon } from '@crown/data';

@Component({
  selector: 'crown-toast',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [animate('500ms ease-in', style({ opacity: 1 }))]),
      transition(':leave', [animate('500ms ease-out', style({ opacity: 0 }))]),
    ]),
  ],
})
export class ToastComponent {
  closeToast = new EventEmitter();
  @Input() type = NotificationType.INFO;
  @Input() title: string = 'title';
  @Input() message: string = 'message';
  @Input() icon: string = ToastIcon.Info;
  @Input() duration: number = 5000;
  @Input() position: number = 0; // Position of the toast

  private _iconMap = {
    info: 'info',
    success: 'done',
    error: 'error_outline',
    warning: 'warning',
  };

  get iconName(): string {
    return this._iconMap[this.type];
  }

  get container(): HTMLElement {
    return this._host.nativeElement.querySelector('.toast') as HTMLElement;
  }

  constructor(private _host: ElementRef<HTMLElement>) {}

  close(): void {
    this.container.style.animation = 'toastOut 1s';
    this.closeToast.emit();
  }

  animationDone(event: AnimationEvent): void {
    if (event.animationName === 'toastOut') {
      this.closeToast.emit();
    }
  }

  ngOnDestroy(): void {
    // Clean up logic if needed
  }
}
