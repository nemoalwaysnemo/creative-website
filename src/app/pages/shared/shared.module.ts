import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { SharedDirectiveModule } from './directives/shared-directive.module';
import { AbstractClassesModule } from './abstract-classes/abstract-classes.module';
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
  DocumentRelatedBrandModule,
  BatchFileUploadModule,
  DirectorySuggestionModule,
  DocumentFormModule,
  HomeSearchFormModule,
  ShareDocumentButtonModule,
  GlobalDocumentFormModule,
  DocumentActionGroupModule,
  KnowledgeSearchFormModule,
  SelectableActionBarModule,
  DocumentFeaturedCarouselModule,
} from './';

const EXPORTS = [
  CommonModule,
  ThemeModule,
  AbstractClassesModule,
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
  DocumentRelatedBrandModule,
  DirectorySuggestionModule,
  BatchFileUploadModule,
  DocumentViewerModule,
  DocumentFormModule,
  HomeSearchFormModule,
  DocumentActionGroupModule,
  ShareDocumentButtonModule,
  GlobalDocumentFormModule,
  KnowledgeSearchFormModule,
  SelectableActionBarModule,
  DocumentFeaturedCarouselModule,
];

@NgModule({
  exports: [
    ...EXPORTS,
  ],
})
export class SharedModule {

}
