import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Colors, PriceByTypePipe, SumByMonthPipe } from '@crown/data';

@Component({
  selector: 'crown-new-groups',
  standalone: true,
  imports: [CommonModule, SumByMonthPipe, PriceByTypePipe],
  templateUrl: './new-groups.component.html',
  styleUrl: './new-groups.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewGroupsComponent implements OnInit {
  @Input() data!: any; // TODO: no any

  ngOnInit(): void {
    console.log('%c[NewGroupsComponent INIT]', Colors.MAG, this.data);
  }
}
