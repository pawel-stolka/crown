import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  Injectable,
  Injector,
  ViewContainerRef,
} from '@angular/core';
import { ToastComponent } from '../toast/toast.component';

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

  showSuccess(msg: string) {
    this.showToast('Sukces', msg, 'check');
  }
  showInfo(msg: string) {
    this.showToast('Info', msg, 'warning');
  }
  showWarning(msg: string) {
    this.showToast('Ostrzeżenie', msg, 'priority_high');
  }
  showError(msg: string) {
    this.showToast('Błąd', msg, 'error');
  }

  showToast(title: string, message: string, icon: string, duration: number = 5000) {
    const factory = this.resolver.resolveComponentFactory(ToastComponent);
    const componentRef = this.toastContainerRef.createComponent(factory);

    // Calculate position based on the number of existing toasts
    const position = this.toasts.length * 100; // Adjust 50 to your toast height + margin

    // ... set the properties and handle removal
    componentRef.instance.title = title;
    componentRef.instance.message = message;
    componentRef.instance.icon = icon;
    componentRef.instance.duration = duration;
    componentRef.instance.position = position;

    console.log('duration', duration);


    this.toasts.push(componentRef);
    console.log('[this.toasts]', this.toasts);

    const totalDuration = duration + 300;
    // TODO: don't remove temporarly
    setTimeout(() => {
      const index = this.toasts.indexOf(componentRef);
      if (index >= 0) {
        this.toastContainerRef.remove(index);
        this.toasts.splice(index, 1);
      }
    }, totalDuration);
    // STOP

    // Automatically remove the toast after the duration
    // setTimeout(() => {
    //   this.toastContainerRef.remove(this.toastContainerRef.indexOf(componentRef.hostView));
    // }, duration);

    // this.appRef.attachView(componentRef.hostView);

    // const domElem = (componentRef.hostView as any).rootNodes[0] as HTMLElement;
    // document.body.appendChild(domElem);

    // this.toastComponents.push(componentRef);

    // setTimeout(() => {
    //   this.appRef.detachView(componentRef.hostView);
    //   componentRef.destroy();
    //   this.toastComponents = this.toastComponents.filter(
    //     (compRef) => compRef !== componentRef
    //   );
    // }, duration);
  }

  /*
  private toastComponents: unknown[] = [];

  constructor(
    private appRef: ApplicationRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector
  ) {}

  showToast(
    title: string,
    message: string,
    icon: string,
    duration: number = 3000
  ) {
    const componentFactory =
      this.componentFactoryResolver.resolveComponentFactory(ToastComponent);
    const componentRef = componentFactory.create(this.injector);

    componentRef.instance.title = title;
    componentRef.instance.message = message;
    componentRef.instance.icon = icon;
    componentRef.instance.duration = duration;

    this.appRef.attachView(componentRef.hostView);

    const domElem = (componentRef.hostView as any).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);

    this.toastComponents.push(componentRef);

    setTimeout(() => {
      this.appRef.detachView(componentRef.hostView);
      componentRef.destroy();
      this.toastComponents = this.toastComponents.filter(
        (compRef) => compRef !== componentRef
      );
    }, duration);
  }
  */
}
