import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { SharedDirectiveModule } from './directives/shared-directive.module';
import {
  OptionSelectModule,
  PictureGalleryModule,
  DocumentListViewModule,
  DocumentViewerModule,
  DocumentMetadataInfoModule,
  DocumentAdditionalInfoModule,
  DocumentBackslashInfoModule,
  DocumentRelatedAgencyModule,
  DocumentRelatedInfoComponentModule,
  DocumentRelatedCampaignModule,
  DocumentRelatedProjectModule,
  BatchFileUploadModule,
  DirectorySuggestionModule,
  DocumentFormModule,
  HomeSearchFormModule,
  ShareDocumentButtonModule,
  GlobalDocumentFormModule,
  DocumentActionGroupModule,
} from './';

const EXPORTS = [
  CommonModule,
  ThemeModule,
  OptionSelectModule,
  PictureGalleryModule,
  SharedDirectiveModule,
  DocumentListViewModule,
  DocumentMetadataInfoModule,
  DocumentAdditionalInfoModule,
  DocumentBackslashInfoModule,
  DocumentRelatedAgencyModule,
  DocumentRelatedInfoComponentModule,
  DocumentRelatedCampaignModule,
  DocumentRelatedProjectModule,
  DirectorySuggestionModule,
  BatchFileUploadModule,
  DocumentViewerModule,
  DocumentFormModule,
  HomeSearchFormModule,
  DocumentActionGroupModule,
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
