import { NgModule } from '@angular/core';
import { ThumbnailViewComponent, ThumbnailViewItemComponent } from './thumbnail-view.component';
import { CommonModule } from '@angular/common';

const thumbnailViewComponent = [ThumbnailViewComponent, ThumbnailViewItemComponent];

@NgModule({
  imports: [CommonModule],
  declarations: [...thumbnailViewComponent],
  exports: [
    ...thumbnailViewComponent,
  ],
})
export class ThumbnailViewModule {
}
