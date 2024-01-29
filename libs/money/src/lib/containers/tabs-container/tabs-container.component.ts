import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupsTabComponent } from '../../components/tabs/groups-tab/groups-tab.component';
import { Money, MonthsCategories } from '@crown/data';
import { DetailsTabComponent } from '../../components/tabs/details-tab/details-tab.component';
import { MatTabsModule } from '@angular/material/tabs';
import { AccordionModule } from 'primeng/accordion';
import { DoughnutComponent } from '../../components/doughnut/doughnut.component';

@Component({
  selector: 'crown-tabs-container',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    AccordionModule,
    GroupsTabComponent,
    DetailsTabComponent,
    DoughnutComponent,
  ],
  templateUrl: './tabs-container.component.html',
  styleUrl: './tabs-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsContainerComponent {
  @Input() data: MonthsCategories | null = {} as MonthsCategories;
  @Input() money!: Money[] | undefined;
}
