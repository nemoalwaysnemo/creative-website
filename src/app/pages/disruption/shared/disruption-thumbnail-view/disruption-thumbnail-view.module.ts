import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DisruptionThumbnailViewComponent } from './disruption-thumbnail-view.component';
import { PaginationModule } from 'app/pages/shared/pagination/pagination.module';
@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    PaginationModule,
    RouterModule,
  ],
  declarations: [
    DisruptionThumbnailViewComponent,
  ], exports: [
    DisruptionThumbnailViewComponent,
  ],
})

export class DisruptionThumbnailViewModule {

}
