import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabsContainerComponent } from './tabs-container.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { DetailsTabComponent } from '../../components/tabs/details-tab/details-tab.component';
import { GroupsTabComponent } from '../../components/tabs/groups-tab/groups-tab.component';
import { ChartDemoComponent } from '../../components/chart-demo/chart-demo.component';
import { ChartComponent } from '../../components/chart/chart.component';
import { DoughnutDemoComponent } from '../../components/doughnut-demo/doughnut-demo.component';
import { By } from '@angular/platform-browser';
import { MonthsCategories } from '@crown/data';

describe('TabsContainerComponent', () => {
  let component: TabsContainerComponent;
  let fixture: ComponentFixture<TabsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        MatTabsModule,
        GroupsTabComponent,
        DetailsTabComponent,
        TabsContainerComponent,
        ChartComponent,
        ChartDemoComponent,
        DoughnutDemoComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA], // Use this if you don't want to deal with child components' details
    }).compileComponents();

    fixture = TestBed.createComponent(TabsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TODO: finish
  it('should correctly initialize inputs', () => {
    expect(component.data).toEqual({} as MonthsCategories);
    expect(component.money).toBeUndefined(); // or your default value
  });

  it('should render two tabs', () => {
    const tabLabels = fixture.debugElement.queryAll(By.css('.mat-mdc-tab'));
    expect(tabLabels.length).toEqual(2);
  });
});
