import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { NbAccordionModule, NbTabsetModule, NbSpinnerModule } from '@core/nebular/theme';
import { SharedModule } from '@pages/shared/shared.module';
import { DetailComponent } from './detail.component';
import { SimplePdfViewerModule } from 'simple-pdf-viewer';
import { ImageViewerModule } from 'ngx-image-viewer';
import { DocumentMetadataInfoComponent } from './document-metadata-info/document-metadata-info.component';
import { DocumentAdditionalInfoComponent } from './document-additional-info/document-additional-info.component';
import { DocumentRelatedInfoComponent } from './document-related-info/document-related-info.component';
import { DocumentRelatedInfoViewComponent } from './document-related-info/document-related-info-view/document-related-info-view.component';
import { DocumentRelatedInfoService } from './document-related-info/document-related-info.service';
import { DocumentPdfViewerComponent } from './docment-pdf-viewer/docment-pdf-viewer.component';
import { DocumentImageViewerComponent } from '@pages/detail/docment-image-viewer/docment-image-viewer.component';
import { DocumentRelatedProjectComponent } from './document-related-project/document-related-project.component';
import { DocumentRelatedAgencyComponent } from './document-related-agency/document-related-agency.component';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    NbAccordionModule,
    NbTabsetModule,
    NbSpinnerModule,
    SimplePdfViewerModule,
    ImageViewerModule,
  ],
  declarations: [
    DetailComponent,
    DocumentMetadataInfoComponent,
    DocumentAdditionalInfoComponent,
    DocumentRelatedInfoComponent,
    DocumentRelatedInfoViewComponent,
    DocumentPdfViewerComponent,
    DocumentImageViewerComponent,
    DocumentRelatedProjectComponent,
    DocumentRelatedAgencyComponent,
  ],
  providers: [
    SharedModule.forRoot().providers,
    DocumentRelatedInfoService,
  ],
})
export class DetailPageModule { }