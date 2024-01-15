import { Component } from '@angular/core';
import { MaterialModule } from '@crown/material';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'crown-home',
  standalone: true,
  template: `
    <div class="title">Witaj w Crownie 👋</div>

    <div class="info">
      <span>
        To appka stworzona przeze mnie na prywatne potrzeby analizy wydatków (na
        potrzeby kursu Crown).
      </span>

      <div>
        <a href="https://dlarodziny.eu/crown/" target="_blank"
          >dlarodziny.eu/crown/</a
        >
      </div>
    </div>

    <div class="intro">
      <div>Na początek wypróbuj ją na koncie testowym</div>
      <div class="highlight">zaloguj się ☝️</div>
    </div>

    <div class="tutorial">
      <div>CHCESZ WIEDZIEĆ WIĘCEJ? 👇</div>

      <mat-expansion-panel>
        <mat-expansion-panel-header>
          <div>krótki przewodnik po apce</div>
        </mat-expansion-panel-header>

        <ng-template matExpansionPanelContent>
          <img
            ngSrc="assets/screen_3.PNG"
            width="1098"
            height="560"
            alt="screen_3.PNG"
          />
          <img
            ngSrc="assets/screen_4.PNG"
            width="1098"
            height="598"
            alt="screen_4.PNG"
          />
          <img
            ngSrc="assets/screen_6.PNG"
            width="1080"
            height="748"
            alt="screen_6.PNG"
          />
        </ng-template>
      </mat-expansion-panel>
    </div>
  `,
  styleUrls: ['./home.component.scss'],
  imports: [MaterialModule, NgOptimizedImage],
})
export class HomeComponent {}
