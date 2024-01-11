import { AfterViewInit, Component, OnInit, ViewChild, ViewContainerRef, inject } from '@angular/core';
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
import { NewToastService } from "@crown/ui";

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
export class AppComponent implements OnInit, AfterViewInit {

  title = 'crown';
  @ViewChild('menuSidenav') menuSidenav!: MatSidenav;
  @ViewChild('todoSidenav') todoSidenav!: MatSidenav;
  @ViewChild('toastContainer', { read: ViewContainerRef })
  toastContainerRef!: ViewContainerRef;

  menuMode = new FormControl('over' as MatDrawerMode);
  todoMode = new FormControl('over' as MatDrawerMode);

  private todoService = inject(TodoService);
  private toastService = inject(NewToastService)

  ngOnInit(): void {
    // this.toast();
  }

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

  toast(message = 'Coś udało się zrobić, pytanie co??? :D') {
    console.log('[this.toast]', message);

    this.toastService.showToast('Sukces', message, 'icon-class', 5000);
  }
}
