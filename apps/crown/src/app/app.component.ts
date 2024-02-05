import {
  AfterViewInit,
  Component,
  ViewChild,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSidenav, MatDrawerMode } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@crown/material';
import { TodoContainerComponent, TodoService } from '@crown/todo';
import {
  MainToolbarComponent,
  NavigationComponent,
  ToastService,
} from '@crown/shared';

@Component({
  // standalone: true,
  // imports: [
  //   MainToolbarComponent,
  //   NavigationComponent,
  //   RouterModule,
  //   MaterialModule,
  //   TodoContainerComponent,
  // ],

  selector: 'crown-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements AfterViewInit {
  title = 'crown';
  @ViewChild('menuSidenav') menuSidenav!: MatSidenav;
  @ViewChild('todoSidenav') todoSidenav!: MatSidenav;
  @ViewChild('toastContainer', { read: ViewContainerRef })
  toastContainerRef!: ViewContainerRef;

  menuMode = new FormControl('over' as MatDrawerMode);
  todoMode = new FormControl('over' as MatDrawerMode);

  private todoService = inject(TodoService);
  private toastService = inject(ToastService);

  ngAfterViewInit() {
    this.toastService.setToastContainer(this.toastContainerRef);
  }

  toggleTodos() {
    this.todoSidenav.toggle();
    this.todoService.fetchAll$().subscribe();
  }

  toggleMenu() {
    this.menuSidenav.toggle();
  }
}
