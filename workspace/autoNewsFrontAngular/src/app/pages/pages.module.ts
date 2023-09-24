import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainScreenComponent } from './main-screen/main-screen.component';
import { ComponentsModule } from '../components/components.module';



@NgModule({
  declarations: [
    MainScreenComponent
  ],
  exports: [
    MainScreenComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule
  ]
})
export class PagesModule { }
