import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoneyService } from '../../services/money.service';
import { MaterialModule } from '@crown/material';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'crown-simple-list',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './simple-list.component.html',
  styleUrl: './simple-list.component.scss',
})
export class SimpleListComponent {
  money$ = this.moneyService.money$;

  constructor(
    private dialog: MatDialog,
    private moneyService: MoneyService
  ) {}

  add() {
    console.log('add');

  }
}
