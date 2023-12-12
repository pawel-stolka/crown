import { Component } from '@angular/core';

@Component({
  selector: 'home',
  template: `
    <div class="title">Witaj w Crownie 👋</div>

    <div class="info">
      To appka stworzona przeze mnie na prywatne potrzeby analizy wydatków
      <div class="ps">(na podstawie kursu Crown)</div>
    </div>

    <div class="intro">
      Na początek wypróbuj ją na koncie testowym
      <span class="highlight"> zaloguj się ☝️</span>
    </div>
  `,
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {}
