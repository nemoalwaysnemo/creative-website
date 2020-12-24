import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { SharedDirectiveModule } from './directives/shared-directive.module';
import { AbstractClassesModule } from './abstract-classes/abstract-classes.module';
import {
  PictureGalleryModule,
  DocumentListViewModule,
  DocumentViewerModule,
  DocumentMetadataInfoModule,
  DocumentAdditionalInfoModule,
  DocumentBackslashInfoModule,
  DocumentRelatedAgencyModule,
  DocumentRelatedInfoModule,
  DocumentRelatedCampaignModule,
  DocumentRelatedBrandModule,
  DocumentFormModule,
  HomeSearchFormModule,
  DocumentShareButtonModule,
  GlobalDocumentFormModule,
  DocumentRouteTabsetModule,
  DocumentActionGroupModule,
  KnowledgeSearchFormModule,
  SelectableActionBarModule,
  DocumentFeaturedCarouselModule,
  DocumentUsageRightsStatusModule,
  DocumentLearningProgramInfoModule,
} from './';

const EXPORTS = [
  CommonModule,
  ThemeModule,
  AbstractClassesModule,
  PictureGalleryModule,
  SharedDirectiveModule,
  DocumentListViewModule,
  DocumentMetadataInfoModule,
  DocumentAdditionalInfoModule,
  DocumentBackslashInfoModule,
  DocumentRelatedAgencyModule,
  DocumentRelatedInfoModule,
  DocumentRelatedCampaignModule,
  DocumentRelatedBrandModule,
  DocumentViewerModule,
  DocumentFormModule,
  HomeSearchFormModule,
  DocumentRouteTabsetModule,
  DocumentActionGroupModule,
  DocumentShareButtonModule,
  GlobalDocumentFormModule,
  KnowledgeSearchFormModule,
  SelectableActionBarModule,
  DocumentFeaturedCarouselModule,
  DocumentUsageRightsStatusModule,
  DocumentLearningProgramInfoModule,
];

@NgModule({
  exports: [
    ...EXPORTS,
  ],
})
export class SharedModule {

}
