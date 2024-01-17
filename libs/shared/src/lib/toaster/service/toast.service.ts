import {
  ComponentFactoryResolver,
  ComponentRef,
  Injectable,
  ViewContainerRef,
} from '@angular/core';
import { ToastComponent } from '../toast/toast.component';
import {
  EMPTY_STRING,
  NotificationMessage,
  NotificationType,
} from '@crown/data';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastContainerRef!: ViewContainerRef;
  private toasts: ComponentRef<ToastComponent>[] = [];

  icon!: string;
  duration: number = 5000;

  constructor(private resolver: ComponentFactoryResolver) {}

  setToastContainer(container: ViewContainerRef) {
    this.toastContainerRef = container;
  }

  notify(notification: NotificationMessage): void {
    const factory = this.resolver.resolveComponentFactory(ToastComponent);
    const componentRef = this.toastContainerRef.createComponent(factory);

    componentRef.instance.type = notification.type;
    componentRef.instance.title = notification.title;
    componentRef.instance.message = notification.message ?? EMPTY_STRING;
    componentRef.instance.icon = notification.icon;
    componentRef.instance.duration = this.duration;

    this.toasts.push(componentRef);

    if (
      notification.type === NotificationType.INFO ||
      notification.type === NotificationType.SUCCESS
    ) {
      setTimeout(() => {
        const index = this.toasts.indexOf(componentRef);
        if (index >= 0) {
          this.toastContainerRef.remove(index);
          this.toasts.splice(index, 1);
        }
      }, this.duration);
    }
    const subscription = componentRef.instance.closeToast.subscribe(() => {
      this.removeToast(componentRef);
      subscription.unsubscribe();
      componentRef.destroy();
    });
  }

  showSuccess(title: string, message: string) {
    this.notify({
      type: NotificationType.SUCCESS,
      title,
      message,
      icon: 'check',
    });
  }

  showInfo(title: string, message: string) {
    this.notify({ type: NotificationType.INFO, title, message, icon: 'info' });
  }

  showWarning(title: string, message: string) {
    this.notify({
      type: NotificationType.WARNING,
      title,
      message,
      icon: 'priority_high',
    });
  }

  showError(title: string, message: string) {
    this.notify({
      type: NotificationType.ERROR,
      title,
      message,
      icon: 'error',
    });
  }

  private removeToast(componentRef: ComponentRef<ToastComponent>) {
    const index = this.toasts.indexOf(componentRef);

    if (index >= 0) {
      this.toastContainerRef.remove(index);
      this.toasts.splice(index, 1);
    }
  }

  ngOnDestroy(): void {
    // TODO
  }
}
