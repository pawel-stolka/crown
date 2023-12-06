import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@crown/material';
import { NavComponent, ToastService } from '@crown/ui';
import { TodoContainerComponent } from 'libs/todo/src/lib/container/todo-container.component';
import { TodoService } from 'libs/todo/src/lib/services/todo.service';

@Component({
  standalone: true,
  imports: [
    NavComponent,
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

  title = 'crown';

  mode = new FormControl('over' as MatDrawerMode);

  constructor(private toastService: ToastService,
    private todoService: TodoService
    ) {}

  ngAfterViewInit() {
    this.toastService.setToastContainer(this.toastContainerRef);
  }

  onSidenavOpen() {
    console.log('onSidenavOpen');
    this.todoService.fetchAll$(null).subscribe();
  }
}
