import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'crown-doughnut',
  standalone: true,
  imports: [CommonModule, ChartModule],
  templateUrl: './doughnut.component.html',
  styleUrl: './doughnut.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoughnutComponent {
  @Input() data: any[] = [];
  _data: any;

  options: any;

  ngOnInit() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this._data = {
      labels: ['A', 'B', 'C', 'D', 'E', 'F', 'g', 'h', 'i', 'j'],
      datasets: [
        {
          data: [300, 50, 10, 100, 50, 80, 150, 300, 10, 15],
          backgroundColor: [
            documentStyle.getPropertyValue('--red'),
            documentStyle.getPropertyValue('--orange'),
            documentStyle.getPropertyValue('--yellow'),
            documentStyle.getPropertyValue('--lime'),
            documentStyle.getPropertyValue('--green'),
            documentStyle.getPropertyValue('--mint'),
            documentStyle.getPropertyValue('--teal'),
            documentStyle.getPropertyValue('--cyan'),
            documentStyle.getPropertyValue('--lightBlue'),
            documentStyle.getPropertyValue('--blue'),
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue('--red'),
            documentStyle.getPropertyValue('--orange'),
            documentStyle.getPropertyValue('--yellow'),
            documentStyle.getPropertyValue('--lime'),
            documentStyle.getPropertyValue('--green'),
            documentStyle.getPropertyValue('--mint'),
            documentStyle.getPropertyValue('--teal'),
            documentStyle.getPropertyValue('--cyan'),
            documentStyle.getPropertyValue('--lightBlue'),
            documentStyle.getPropertyValue('--blue'),
          ],
        },
      ],
    };

    this.options = {
      cutout: '50%',
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 500 / 800,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
    };
  }
}
