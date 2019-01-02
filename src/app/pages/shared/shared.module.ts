import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { AdvanceSearch } from './services/advance-search.service';

import {
  OptionSelectModule,
  PictureGalleryModule,
  ThumbnailViewModule,
  PaginationModule,
} from './';

const MODULES = [
  CommonModule,
  ThemeModule,
  OptionSelectModule,
  PictureGalleryModule,
  ThumbnailViewModule,
  PaginationModule,
];

const PROVIDERS = [
  AdvanceSearch,
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
