import { Component, ViewChild, inject } from '@angular/core';
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
import { TodoService } from 'libs/shared/src/lib/services/todo/todo.service';

// TODO: inspect injection token
// import { TodoService } from 'libs/shared/src/lib/services/todo/todo.service';

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

  private todoService = inject(TodoService);

  toggleTodos() {
    this.todoSidenav.toggle();
    this.todoService.fetchAll$(null).subscribe();
  }

  toggleMenu() {
    this.menuSidenav.toggle();
  }
}
