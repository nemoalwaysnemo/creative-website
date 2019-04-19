import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { SharedDirectiveModule } from './directives/shared-directive.module';
import {
  OptionSelectModule,
  PictureGalleryModule,
  PaginationModule,
  ListViewModule,
  DocumentViewerModule,
  DocumentMetadataInfoModule,
  DocumentAdditionalInfoModule,
  DocumentRelatedAgencyModule,
  DocumentRelatedInfoComponentModule,
  DocumentRelatedProjectModule,
  BatchFileUploadModule,
  PreviewDialogModule,
  DirectorySuggestionModule,
  DocumentFormModule,
  HomeSearchFormModule,
} from './';

const EXPORTS = [
  HomeSearchFormModule,
  CommonModule,
  ThemeModule,
  OptionSelectModule,
  PictureGalleryModule,
  PaginationModule,
  ListViewModule,
  SharedDirectiveModule,
  BatchFileUploadModule,
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
  ...PreviewDialogModule.forRoot().providers,
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
