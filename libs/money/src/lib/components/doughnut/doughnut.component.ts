import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { TypePrice } from '@crown/data';

@Component({
  selector: 'crown-doughnut',
  standalone: true,
  imports: [CommonModule, ChartModule],
  templateUrl: './doughnut.component.html',
  styleUrl: './doughnut.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoughnutComponent implements OnChanges {
  @Input() dataset: any;
  @Input() aspectRatio: number = 500 / 800;

  data: any;
  documentStyle = getComputedStyle(document.documentElement);
  color = this.documentStyle.getPropertyValue('--text-color');

  options = {
    cutout: '50%',
    // responsive: true,
    maintainAspectRatio: false,
    aspectRatio: this.aspectRatio,
    plugins: {
      legend: {
        labels: {
          color: this.color,
        },
      },
    },
  };

  ngOnChanges(changes: SimpleChanges): void {
    const { categories, months } = this.dataset;
    let { typePrices } = months[months.length - 1];

    this.data = {
      labels: categories,
      datasets: [
        {
          data: getValues(categories, typePrices),
          backgroundColor: generateColors(this.documentStyle),
          hoverBackgroundColor: generateColors(this.documentStyle),
        },
      ],
    };
  }
}

function getValues(labels: string[], typePrices: TypePrice[]) {
  return typePrices
    ?.sort((a, b) => {
      return labels.indexOf(a.type) - labels.indexOf(b.type);
    })
    .map((tp) => tp.price);
}

function generateColors(documentStyle: CSSStyleDeclaration) {
  return [
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
    documentStyle.getPropertyValue('--indigo'),
    documentStyle.getPropertyValue('--deepPurple'),
    documentStyle.getPropertyValue('--purple'),
    documentStyle.getPropertyValue('--pink'),
    documentStyle.getPropertyValue('--hotPink'),
    documentStyle.getPropertyValue('--warmGray'),
    documentStyle.getPropertyValue('--gray'),
    documentStyle.getPropertyValue('--coolGray'),
    documentStyle.getPropertyValue('--brown'),
    documentStyle.getPropertyValue('--burgundy'),
    documentStyle.getPropertyValue('--olive'),
    documentStyle.getPropertyValue('--beige'),
    documentStyle.getPropertyValue('--coral'),
    documentStyle.getPropertyValue('--navy'),
    documentStyle.getPropertyValue('--maroon'),
    documentStyle.getPropertyValue('--lightGreen'),
    documentStyle.getPropertyValue('--turquoise'),
    documentStyle.getPropertyValue('--skyBlue'),
    documentStyle.getPropertyValue('--gold'),
    documentStyle.getPropertyValue('--plum'),
  ];
}
