import {
  ApplicationRef,
  ComponentFactoryResolver,
  Injectable,
  Injector,
  ViewContainerRef,
} from '@angular/core';
import { ToastComponent } from '../toast/toast.component';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastContainer!: ViewContainerRef;

  constructor(private resolver: ComponentFactoryResolver) {}

  setToastContainer(container: ViewContainerRef) {
    this.toastContainer = container;
  }

  showToast(title: string, message: string, icon: string, duration: number = 3000) {
    const factory = this.resolver.resolveComponentFactory(ToastComponent);
    const componentRef = this.toastContainer.createComponent(factory);
    // ... set the properties and handle removal
    componentRef.instance.title = title;
    componentRef.instance.message = message;
    componentRef.instance.icon = icon;
    componentRef.instance.duration = duration;



    // Automatically remove the toast after the duration
    setTimeout(() => {
      this.toastContainer.remove(this.toastContainer.indexOf(componentRef.hostView));
    }, duration);

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
