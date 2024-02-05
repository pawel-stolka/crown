import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app.routing.module';
import { MaterialModule } from '@crown/material';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainToolbarComponent, NavigationComponent } from '@crown/shared';
import { TodoContainerComponent } from '@crown/todo';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    MainToolbarComponent,
    NavigationComponent,
    MaterialModule,
    TodoContainerComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
