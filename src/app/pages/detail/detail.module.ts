import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { NbAccordionModule, NbTabsetModule, NbSpinnerModule } from '@core/nebular/theme';
import { SharedModule } from '@pages/shared/shared.module';
import { DetailComponent } from './detail.component';
import { DocumentMetadataInfoComponent } from './document-metadata-info/document-metadata-info.component';
import { DocumentAdditionalInfoComponent } from './document-additional-info/document-additional-info.component';
import { DocumentRelatedInfoComponent } from './document-related-info/document-related-info.component';
import { DocumentRelatedInfoViewComponent } from './document-related-info/document-related-info-view/document-related-info-view.component';
import { DocumentRelatedInfoService } from './document-related-info/document-related-info.service';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    NbAccordionModule,
    NbTabsetModule,
    NbSpinnerModule,
  ],
  declarations: [
    DetailComponent,
    DocumentMetadataInfoComponent,
    DocumentAdditionalInfoComponent,
    DocumentRelatedInfoComponent,
    DocumentRelatedInfoViewComponent,
  ],
  providers: [
    SharedModule.forRoot().providers,
    DocumentRelatedInfoService,
  ],
})
export class DetailPageModule { }
