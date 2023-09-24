import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BackgroundVideoComponent } from './background-video/background-video.component';
import { GraphComponent } from './graph/graph.component';
import { LiveLogoComponent } from './live-logo/live-logo.component';
import { TimeComponent } from './time/time.component';
import { NewSliderComponent } from './new-slider/new-slider.component';
import { LogoVideoComponent } from './logo-video/logo-video.component';

@NgModule({
  declarations: [
    BackgroundVideoComponent,
    GraphComponent,
    LiveLogoComponent,
    TimeComponent,
    NewSliderComponent,
    LogoVideoComponent,
  ],
  exports: [
    BackgroundVideoComponent,
    GraphComponent,
    LiveLogoComponent,
    TimeComponent,
    NewSliderComponent,
    LogoVideoComponent,
  ],
  imports: [CommonModule],
})
export class ComponentsModule {}
