import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BackgroundVideoComponent } from './background-video/background-video.component';
import { GraphComponent } from './graph/graph.component';
import { LiveLogoComponent } from './live-logo/live-logo.component';
import { TimeComponent } from './time/time.component';



@NgModule({
  declarations: [
    BackgroundVideoComponent,
    GraphComponent,
    LiveLogoComponent,
    TimeComponent,
  ],
  exports: [
    BackgroundVideoComponent,
    GraphComponent,
    LiveLogoComponent,
    TimeComponent,
  ],
  imports: [
    CommonModule
  ]
})
export class ComponentsModule { }
