import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@crown/material';
import { GroupsTabComponent } from '../../components/tabs/groups-tab/groups-tab.component';
import { Money, MonthsCategories } from '@crown/data';
import { DetailsTabComponent } from '../../components/tabs/details-tab/details-tab.component';

@Component({
  selector: 'crown-tabs0-container',
  standalone: true,
  imports: [CommonModule, MaterialModule, GroupsTabComponent, DetailsTabComponent],
  templateUrl: './tabs0-container.component.html',
  styleUrl: './tabs0-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tabs0ContainerComponent {
  @Input() data: MonthsCategories | null = {} as MonthsCategories;
  // @Input() money: any[] = [];
  @Input() money: any;

  tabChange(index: number) {
    console.log('tabs0 | tabChange', index);

    if (index === 1) {
      // this.dataSource.sort = this.sort;
      // this.dataSource.paginator = this.paginator;
    }
  }
}
