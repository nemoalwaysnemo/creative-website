import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { SharedDirectiveModule } from './directives/shared-directive.module';
import {
  OptionSelectModule,
  PictureGalleryModule,
  PaginationModule,
  DocumentListViewModule,
  DocumentViewerModule,
  DocumentMetadataInfoModule,
  DocumentAdditionalInfoModule,
  DocumentBackslashInfoModule,
  DocumentRelatedAgencyModule,
  DocumentRelatedInfoComponentModule,
  DocumentRelatedProjectModule,
  BatchFileUploadModule,
  DirectorySuggestionModule,
  DocumentFormModule,
  HomeSearchFormModule,
  ShareDocumentButtonModule,
  GlobalDocumentFormModule,
} from './';

const EXPORTS = [
  HomeSearchFormModule,
  CommonModule,
  ThemeModule,
  OptionSelectModule,
  PictureGalleryModule,
  PaginationModule,
  DocumentListViewModule,
  SharedDirectiveModule,
  BatchFileUploadModule,
  DocumentViewerModule,
  DocumentMetadataInfoModule,
  DocumentAdditionalInfoModule,
  DocumentBackslashInfoModule,
  DocumentRelatedAgencyModule,
  DocumentRelatedInfoComponentModule,
  DocumentRelatedProjectModule,
  DocumentFormModule,
  DirectorySuggestionModule,
  ShareDocumentButtonModule,
  GlobalDocumentFormModule,
];

@NgModule({
  exports: [
    ...EXPORTS,
  ],
})
export class SharedModule {

}
