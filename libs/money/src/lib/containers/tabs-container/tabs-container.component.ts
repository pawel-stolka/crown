import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@crown/material';
import { GroupsTabComponent } from '../../components/tabs/groups-tab/groups-tab.component';
import { Money, MonthsCategories } from '@crown/data';
import { DetailsTabComponent } from '../../components/tabs/details-tab/details-tab.component';
import { ChartComponent } from '../../components/chart/chart.component';
import { ChartDemoComponent } from '../../components/chart-demo/chart-demo.component';
import { DoughnutDemoComponent } from '../../components/doughnut-demo/doughnut-demo.component';
import { DoughnutComponent } from '../../components/doughnut/doughnut.component';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'crown-tabs-container',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    GroupsTabComponent,
    DetailsTabComponent,
    ChartComponent,
    ChartDemoComponent,
    DoughnutDemoComponent,
  ],
  templateUrl: './tabs-container.component.html',
  styleUrl: './tabs-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsContainerComponent {
  @Input() data: MonthsCategories | null = {} as MonthsCategories;
  @Input() money!: Money[] | undefined;
}
