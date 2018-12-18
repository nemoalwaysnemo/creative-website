import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThumbnailViewComponent, ThumbnailViewItemComponent } from './thumbnail-view.component';


const COMPONENTS = [ThumbnailViewComponent, ThumbnailViewItemComponent];

@NgModule({
  imports: [CommonModule],
  declarations: [...COMPONENTS],
  exports: [
    ...COMPONENTS,
  ],
})
export class ThumbnailViewModule {

}
