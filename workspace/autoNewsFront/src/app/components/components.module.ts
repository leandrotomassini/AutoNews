import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GraphComponent } from './graph/graph.component';
import { LiveComponent } from './live/live.component';
import { NewsComponent } from './news/news.component';
import { LogoComponent } from './logo/logo.component';



@NgModule({
  declarations: [
    GraphComponent,
    LiveComponent,
    NewsComponent,
    LogoComponent,
  ],
  exports: [
    GraphComponent,
    LiveComponent,
    NewsComponent,
    LogoComponent,
  ],
  imports: [
    CommonModule
  ]
})
export class ComponentsModule { }
