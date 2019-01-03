import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedDirectiveModule } from '../directives/shared-directive.module';
import { ThumbnailViewComponent, ThumbnailViewItemComponent } from './thumbnail-view.component';

const COMPONENTS = [ThumbnailViewComponent, ThumbnailViewItemComponent];

@NgModule({
  imports: [CommonModule, SharedDirectiveModule],
  declarations: [...COMPONENTS],
  exports: [
    ...COMPONENTS,
  ],
})
export class ThumbnailViewModule {

}
