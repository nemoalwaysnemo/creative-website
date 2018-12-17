import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';

import {
  OptionSelectModule,
  PictureGalleryModule,
  AdvanceSearchModule,
  ThumbnailViewModule,
  OptionSelectComponent,
  PictureGalleryComponent,
  AdvanceSearchComponent,
  ThumbnailViewItemComponent,
} from './';

const MODULES = [
  CommonModule,
  ThemeModule,
  OptionSelectModule,
  PictureGalleryModule,
  AdvanceSearchModule,
  ThumbnailViewModule,
];

const PROVIDERS = [
  ...AdvanceSearchModule.forRoot().providers,
  ...ThumbnailViewModule.forRoot().providers,
];

@NgModule({
  exports: [
    ...MODULES,
  ],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: SharedModule,
      providers: [
        ...PROVIDERS,
      ],
    };
  }
}
