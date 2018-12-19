import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';

import {
  OptionSelectModule,
  PictureGalleryModule,
  AdvanceSearchModule,
  ThumbnailViewModule,
  PaginationModule,
} from './';

const MODULES = [
  CommonModule,
  ThemeModule,
  OptionSelectModule,
  PictureGalleryModule,
  AdvanceSearchModule,
  ThumbnailViewModule,
  PaginationModule,
];

const PROVIDERS = [
  ...AdvanceSearchModule.forRoot().providers,
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
