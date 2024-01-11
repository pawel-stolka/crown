import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PriceByTypePipe, SumByMonthPipe } from '@crown/data';

@Component({
  selector: 'crown-new-groups',
  standalone: true,
  imports: [CommonModule, SumByMonthPipe, PriceByTypePipe],
  templateUrl: './groups-tab.component.html',
  styleUrl: './groups-tab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupsTabComponent {
  // @Input() data!: any; // TODO: no any
  @Input() data: any;
}
