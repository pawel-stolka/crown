import {
  ComponentFactoryResolver,
  ComponentRef,
  Injectable,
  ViewContainerRef,
} from '@angular/core';
import { ToastComponent } from '../toast/toast.component';
import { NotificationType } from '@crown/data';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastContainerRef!: ViewContainerRef;
  private toasts: ComponentRef<ToastComponent>[] = [];

  constructor(private resolver: ComponentFactoryResolver) {}

  setToastContainer(container: ViewContainerRef) {
    this.toastContainerRef = container;
  }

  showToast(
    type: NotificationType = NotificationType.INFO,
    title: string,
    message: string,
    icon: string,
    duration: number = 5000
  ) {
    const factory = this.resolver.resolveComponentFactory(ToastComponent);
    const componentRef = this.toastContainerRef.createComponent(factory);

    componentRef.instance.type = type;
    componentRef.instance.title = title;
    componentRef.instance.message = message;
    componentRef.instance.icon = icon;
    componentRef.instance.duration = duration;

    this.toasts.push(componentRef);

    setTimeout(() => {
      const index = this.toasts.indexOf(componentRef);
      if (index >= 0) {
        this.toastContainerRef.remove(index);
        this.toasts.splice(index, 1);
      }
    }, duration);

    const subscription = componentRef.instance.closeToast.subscribe(() => {
      this.removeToast(componentRef);
      subscription.unsubscribe();
      componentRef.destroy();
    });
  }

  showSuccess(title: string, message: string) {
    this.showToast(NotificationType.SUCCESS, title, message, 'check');
  }
  showInfo(title: string, message: string) {
    this.showToast(NotificationType.INFO, title, message, 'info');
  }
  showWarning(title: string, message: string) {
    this.showToast(NotificationType.WARNING, title, message, 'priority_high');
  }
  showError(title: string, message: string) {
    this.showToast(NotificationType.ERROR, title, message, 'error');
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
