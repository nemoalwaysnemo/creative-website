import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { NbAccordionModule, NbTabsetModule, NbSpinnerModule } from '@core/nebular/theme';
import { AssetViewComponent } from './asset-view.component';
import { DocumentMetadataInfoComponent } from './document-metadata-info/document-metadata-info.component';
import { DocumentAdditionalInfoComponent } from './document-additional-info/document-additional-info.component';
import { DocumentRelatedInfoComponent } from './document-related-info/document-related-info.component';
import { DocumentRelatedInfoViewComponent } from './document-related-info/document-related-info-view/document-related-info-view.component';
import { DocumentRelatedInfoService } from './document-related-info/document-related-info.service';
import { DocumentRelatedProjectComponent } from './document-related-project/document-related-project.component';
import { DocumentRelatedAgencyComponent } from './document-related-agency/document-related-agency.component';
import { DocumentViewerModule } from './document-viewer/document-viewer.module';
import { CreativeThumbnailViewModule } from '../creative-thumbnail-view/thumbnail-view.module';

const EXPORTS = [
  AssetViewComponent,
];

@NgModule({
  imports: [
    ThemeModule,
    NbAccordionModule,
    NbTabsetModule,
    NbSpinnerModule,
    DocumentViewerModule,
    CreativeThumbnailViewModule,
  ],
  declarations: [
    AssetViewComponent,
    DocumentMetadataInfoComponent,
    DocumentAdditionalInfoComponent,
    DocumentRelatedInfoComponent,
    DocumentRelatedInfoViewComponent,
    DocumentRelatedProjectComponent,
    DocumentRelatedAgencyComponent,
  ],
  providers: [
    DocumentRelatedInfoService,
  ],
  exports: [
    ...EXPORTS,
  ],
})
export class AssetViewModule { }