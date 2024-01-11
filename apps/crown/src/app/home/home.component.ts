import { Component } from '@angular/core';

@Component({
  selector: 'crown-home',
  template: `
    <div class="title">Witaj w Crownie 👋</div>

    <div class="info">
      <div>
        To appka stworzona przeze mnie na prywatne potrzeby analizy wydatków
      </div>

      <div class="ps">
        <div>(na podstawie kursu Crown)</div>
        <a href="https://dlarodziny.eu/crown/" target="_blank"
          >dlarodziny.eu/crown/</a
        >
      </div>
    </div>

    <div class="intro">
      <div>Na początek wypróbuj ją na koncie testowym</div>
    </div>
    <span class="highlight"> zaloguj się ☝️</span>
  `,
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {}
