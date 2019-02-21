import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { CommonModule } from '@angular/common';
import { DisruptionThumbnailViewComponent } from './disruption-thumbnail-view.component';
@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
  ],
  declarations: [
    DisruptionThumbnailViewComponent,
  ], exports: [
    DisruptionThumbnailViewComponent,
  ],
})

export class DisruptionThumbnailViewModule {

}
