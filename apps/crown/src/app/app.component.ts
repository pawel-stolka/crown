import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDrawerMode,
  MatSidenav,
  MatSidenavModule,
} from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@crown/material';
import { TodoContainerComponent } from '@crown/todo';
import { MainToolbarComponent, NavigationComponent } from '@crown/ui';

// TODO: inspect injection token
import { TodoService } from 'libs/todo/src/lib/services/todo.service';
import { auth2Interceptor } from './interceptors/auth2.interceptor';



@Component({
  standalone: true,
  imports: [
    MainToolbarComponent,
    NavigationComponent,
    RouterModule,
    MaterialModule,
    MatSidenavModule,
    MatButtonModule,
    TodoContainerComponent,
  ],

  selector: 'crown-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'crown';
  @ViewChild('menuSidenav') menuSidenav!: MatSidenav;
  @ViewChild('todoSidenav') todoSidenav!: MatSidenav;
  // @ViewChild('toastContainer', { read: ViewContainerRef })
  // toastContainerRef!: ViewContainerRef;

  menuMode = new FormControl('over' as MatDrawerMode);
  todoMode = new FormControl('over' as MatDrawerMode);

  constructor(
    // private toastService: ToastService,
    private todoService: TodoService
  ) {}

  toggleTodos() {
    this.todoSidenav.toggle();
    this.todoService.fetchAll$(null).subscribe();
  }

  toggleMenu() {
    this.menuSidenav.toggle();
  }
}

// bootstrapApplication(AppComponent, {
//   providers: [HttpClientModule]
// });
