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
  DocumentViewerModule,
  DocumentMetadataInfoModule,
  DocumentAdditionalInfoModule,
  DocumentRelatedAgencyModule,
  DocumentRelatedInfoComponentModule,
  DocumentRelatedProjectModule,
  BatchFileUploadModule,
  SearchResultModule,
  PreviewDialogService,
  PreviewDialogModule,
  DirectorySuggestionModule,
  DocumentFormModule,
  HomeSearchModule,
} from './';

const EXPORTS = [
  HomeSearchModule,
  CommonModule,
  ThemeModule,
  OptionSelectModule,
  PictureGalleryModule,
  CreativeThumbnailViewModule,
  SearchFilterModule,
  PaginationModule,
  ListViewModule,
  SharedDirectiveModule,
  BatchFileUploadModule,
  SearchResultModule,
  DocumentViewerModule,
  DocumentMetadataInfoModule,
  DocumentAdditionalInfoModule,
  DocumentRelatedAgencyModule,
  DocumentRelatedInfoComponentModule,
  DocumentRelatedProjectModule,
  PreviewDialogModule,
  DocumentFormModule,
  DirectorySuggestionModule,
];

const PROVIDERS = [
  SearchQueryParamsService,
  PreviewDialogService,
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
