import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDrawerMode, MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@crown/material';
import { MainToolbarComponent, NavigationComponent, ToastService } from '@crown/ui';
import { TodoContainerComponent } from 'libs/todo/src/lib/container/todo-container.component';
import { TodoService } from 'libs/todo/src/lib/services/todo.service';

import 'moment/locale/pl';

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
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'pl'},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
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
