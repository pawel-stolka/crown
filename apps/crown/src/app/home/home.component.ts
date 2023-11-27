import { Component } from '@angular/core';

@Component({
  selector: 'home',
  template: `
    <div class="container">
      <div id="welcome">
        <h3>
          <span> Welcome in Crown (reactive-monorepo) 👋 </span>
        </h3>
      </div>
    </div>
  `,
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {}
