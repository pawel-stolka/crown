import {
  ComponentFactoryResolver,
  ComponentRef,
  Injectable,
  ViewContainerRef,
} from '@angular/core';
import { NewToastComponent } from '../new-toast/new-toast.component';
// import { ToastComponent } from '../../toast/toast.component';

@Injectable({
  providedIn: 'root',
})
export class NewToastService {
  private toastContainerRef!: ViewContainerRef;
  private toasts: ComponentRef<NewToastComponent>[] = [];

  constructor(private resolver: ComponentFactoryResolver) {
    // this.setToastContainer()
  }

  setToastContainer(container: ViewContainerRef) {
    this.toastContainerRef = container;
  }

  showToast(
    title: string,
    message: string,
    icon: string,
    duration: number = 3000
  ) {
    const factory = this.resolver.resolveComponentFactory(NewToastComponent);
    const componentRef = this.toastContainerRef.createComponent(factory);

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
  }
}
