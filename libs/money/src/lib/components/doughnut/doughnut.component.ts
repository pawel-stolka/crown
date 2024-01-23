import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { TypePrice, convertHexToRGBA, initFirst30Colors } from '@crown/data';
import { Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// interface Context {
//   chart: {
//     data: {
//       datasets: any,
//       // labels: { [x: string]: string; }
//       labels: any
//     }
// },
// dataset: any,
// dataIndex: string | number
// }

interface LabelProps {
  color: string;
  background_color: string;
  backgroundOpacity: number;
  borderColor: string;
  borderRadius: number;
  borderWidth: number;
  padding: number;
  anchor: string;
  align: string;
  offset: number;
  position: string;
}

@Component({
  selector: 'crown-doughnut',
  standalone: true,
  imports: [CommonModule, ChartModule],
  templateUrl: './doughnut.component.html',
  styleUrl: './doughnut.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoughnutComponent implements OnChanges, OnInit {
  @Input() dataset: any;
  @Input() aspectRatio: number = 500 / 1200;
  @Input() labelProps: LabelProps = {
    background_color: '#ffffff',
    backgroundOpacity: 0.6,

    borderColor: 'black',
    borderRadius: 4,
    borderWidth: 1,
    padding: 6,
    color: '#000',
    anchor: 'end',
    align: 'start',
    offset: 10,
    position: 'outside',
  };

  data: any;
  documentStyle = getComputedStyle(document.documentElement);
  color = this.documentStyle.getPropertyValue('--text-color');
  labelsBackgroundColors = initFirst30Colors(this.documentStyle);

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
      datalabels: {
        ...this.labelProps,
        backgroundColor: convertHexToRGBA(
          this.labelProps.background_color,
          0.6
        ),
        formatter: (value: number, ctx: any) => {
          const { chart, dataset, dataIndex } = ctx;
          const { datasets, labels } = chart.data;
          const [first] = datasets;
          const { data } = first;

          if (datasets.indexOf(dataset) === datasets.length - 1) {
            const sum = data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / sum) * 100);
            const label = labels[dataIndex];
            return `${label} ${percentage}%`;
          } else {
            return '';
          }
        },
      },
    },
  };

  ngOnInit(): void {
    Chart.register(ChartDataLabels);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { categories, months } = this.dataset;
    let { typePrices } = months[months.length - 1];

    this.data = {
      labels: categories,
      datasets: [
        {
          data: getValues(categories, typePrices),
          backgroundColor: this.labelsBackgroundColors,
          hoverBackgroundColor: this.labelsBackgroundColors,
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
