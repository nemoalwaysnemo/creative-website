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
  DirectorySuggestionModule,
  FileUploadModule,
  SearchResultModule,
  PreviewDialogService,
  PreviewDialogModule,
  DocumentFormModule,
} from './';

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
  DocumentViewerModule,
  DocumentMetadataInfoModule,
  DocumentAdditionalInfoModule,
  DocumentRelatedAgencyModule,
  DocumentRelatedInfoComponentModule,
  DocumentRelatedProjectModule,
  DirectorySuggestionModule,
  PreviewDialogModule,
  DocumentFormModule,
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
