import { Component } from '@angular/core';
import { MaterialModule } from '@crown/material';

@Component({
  selector: 'crown-home',
  standalone: true,
  template: `
    <div class="title">Witaj w Crownie 👋</div>

    <div class="info">
      <span>
        To appka stworzona przeze mnie na prywatne potrzeby analizy wydatków (na potrzeby kursu Crown).
      </span>

      <div>
        <a href="https://dlarodziny.eu/crown/" target="_blank"
          >dlarodziny.eu/crown/</a
        >
      </div>
    </div>

    <div class="intro">
      <div>Na początek wypróbuj ją na koncie testowym</div>
      <div class="highlight"> zaloguj się ☝️</div>
    </div>

    <mat-expansion-panel>
      <mat-expansion-panel-header>
        <div>krótki przewodnik po apce</div>
      </mat-expansion-panel-header>

      <ng-template matExpansionPanelContent>
        <div class="tutorial">
          <img src="assets/screen_3.PNG" alt="Description" />
          <img src="assets/screen_4.PNG" alt="Description" />
          <img src="assets/screen_6.PNG" alt="Description" />
        </div>
      </ng-template>
    </mat-expansion-panel>
  `,
  styleUrls: ['./home.component.scss'],
  imports: [MaterialModule],
})
export class HomeComponent {}
