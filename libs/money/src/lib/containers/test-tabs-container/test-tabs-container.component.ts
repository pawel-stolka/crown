import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@crown/material';

@Component({
  selector: 'crown-test-tabs-container',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './test-tabs-container.component.html',
  styleUrl: './test-tabs-container.component.scss',
})
export class TestTabsContainerComponent {

  tabChange(index: number) {
    if (index === 1) {
    }
    console.log('[tabChange]', index);
  }
}
