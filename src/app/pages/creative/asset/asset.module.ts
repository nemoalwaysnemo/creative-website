import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { NbAccordionModule, NbTabsetModule, NbSpinnerModule } from '@core/nebular/theme';
import { SharedModule } from '../../shared/shared.module';
import { AssetComponent } from './asset.component';
import { DocumentMetadataInfoComponent } from './document-metadata-info/document-metadata-info.component';
import { DocumentAdditionalInfoComponent } from './document-additional-info/document-additional-info.component';
import { DocumentRelatedInfoComponent } from './document-related-info/document-related-info.component';
import { DocumentRelatedInfoViewComponent } from './document-related-info/document-related-info-view/document-related-info-view.component';
import { DocumentRelatedInfoService } from './document-related-info/document-related-info.service';
import { DocumentRelatedProjectComponent } from './document-related-project/document-related-project.component';
import { DocumentRelatedAgencyComponent } from './document-related-agency/document-related-agency.component';
import { DocumentViewerModule } from './document-viewer/document-viewer.module';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    NbAccordionModule,
    NbTabsetModule,
    NbSpinnerModule,
    DocumentViewerModule,
  ],
  declarations: [
    AssetComponent,
    DocumentMetadataInfoComponent,
    DocumentAdditionalInfoComponent,
    DocumentRelatedInfoComponent,
    DocumentRelatedInfoViewComponent,
    DocumentRelatedProjectComponent,
    DocumentRelatedAgencyComponent,
  ],
  providers: [
    SharedModule.forRoot().providers,
    DocumentRelatedInfoService,
  ],
})
export class AssetPageModule { }
