import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDrawerMode, MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@crown/material';
import { MainToolbarComponent, NavigationComponent, ToastService } from '@crown/ui';
import { TodoContainerComponent } from 'libs/todo/src/lib/container/todo-container.component';
import { TodoService } from 'libs/todo/src/lib/services/todo.service';

@Component({
  standalone: true,
  imports: [
    // NavComponent,
    MainToolbarComponent,
    NavigationComponent,
    RouterModule,
    MaterialModule,
    MatSidenavModule,
    MatButtonModule,
    TodoContainerComponent
  ],
  selector: 'crown-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  @ViewChild('toastContainer', { read: ViewContainerRef })
  toastContainerRef!: ViewContainerRef;
  @ViewChild('menuSidenav') menuSidenav!: MatSidenav;
  @ViewChild('todoSidenav') todoSidenav!: MatSidenav;

  onMenuSidenavOpen(event: any) {
    this.menuSidenav.toggle();
    console.log('[onMenuSidenavOpen]', event);
  }

  title = 'crown';

  menuMode = new FormControl('over' as MatDrawerMode);
  todoMode = new FormControl('over' as MatDrawerMode);

  constructor(private toastService: ToastService,
    private todoService: TodoService
    ) {}

  ngAfterViewInit() {
    this.toastService.setToastContainer(this.toastContainerRef);
  }

  toggleTodos() {
    console.log('toggleTodos');
    this.todoSidenav.toggle()
    this.todoService.fetchAll$(null).subscribe();
  }

  toggleMenu() {
    console.log('this.toggleMenu');
    this.menuSidenav.toggle();

  }
}
