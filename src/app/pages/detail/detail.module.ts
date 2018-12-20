import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { NbAccordionModule, NbTabsetModule } from '@core/nebular/theme';
import { SharedModule } from '@pages/shared/shared.module';
import { DetailComponent } from './detail.component';
import { DocumentMetadataInfoComponent } from './document-metadata-info/document-metadata-info.component';
import { DocumentAdditionalInfoComponent } from './document-additional-info/document-additional-info.component';
import { DocumentRelatedInfoComponent } from './document-related-info/document-related-info.component';
import { DocumentRelatedInfoViewComponent } from './document-related-info/document-related-info-view/document-related-info-view.component';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    NbAccordionModule,
    NbTabsetModule,
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
  ],
})
export class DetailPageModule { }
