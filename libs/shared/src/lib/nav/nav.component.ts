import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from "@crown/material";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'crown-nav',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent {}
