import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { SharedDirectiveModule } from './directives/shared-directive.module';

import {
  OptionSelectModule,
  PictureGalleryModule,
  ThumbnailViewModule,
  PaginationModule,
} from './';

const EXPORTS = [
  CommonModule,
  ThemeModule,
  OptionSelectModule,
  PictureGalleryModule,
  ThumbnailViewModule,
  PaginationModule,
  SharedDirectiveModule,
];

const PROVIDERS = [
];

@NgModule({
  exports: [
    ...EXPORTS,
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
