import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThumbnailViewComponent, ThumbnailViewItemComponent } from './thumbnail-view.component';
import { ThumbnailViewDataSource } from './thumbnail-view-data-source.service';

const PROVIDERS = [ThumbnailViewDataSource];

const thumbnailViewComponent = [ThumbnailViewComponent, ThumbnailViewItemComponent];

@NgModule({
  imports: [CommonModule],
  declarations: [...thumbnailViewComponent],
  exports: [
    ...thumbnailViewComponent,
  ],
})
export class ThumbnailViewModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: ThumbnailViewModule,
      providers: [
        ...PROVIDERS,
      ],
    };
  }
}
