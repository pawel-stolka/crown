import { Component, ViewChild, ViewContainerRef } from '@angular/core';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NavComponent, ToastService } from '@crown/ui';

@Component({
  standalone: true,
  imports: [NavComponent, RouterModule],
  selector: 'crown-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  @ViewChild('toastContainer', { read: ViewContainerRef })
  toastContainerRef!: ViewContainerRef;

  title = 'crown';

  constructor(private toastService: ToastService) {}

  ngAfterViewInit() {
    this.toastService.setToastContainer(this.toastContainerRef);
  }
}
