import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { SharedDirectiveModule } from './directives/shared-directive.module';

import {
  OptionSelectModule,
  PictureGalleryModule,
  CreativeThumbnailViewModule,
  SearchFilterModule,
  PaginationModule,
  ListViewModule,
  SearchQueryParamsService,
} from './';
import { FileUploadModule } from '@pages/shared/file-upload/file-upload.module';
import { SearchResultModule } from '@pages/shared/search-result/search-result.module';

const EXPORTS = [
  CommonModule,
  ThemeModule,
  OptionSelectModule,
  PictureGalleryModule,
  CreativeThumbnailViewModule,
  SearchFilterModule,
  PaginationModule,
  ListViewModule,
  SharedDirectiveModule,
  FileUploadModule,
  SearchResultModule,
];

const PROVIDERS = [
  SearchQueryParamsService,
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
