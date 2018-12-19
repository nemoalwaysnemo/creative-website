import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { NbAccordionModule } from '@core/nebular/theme';
import { SharedModule } from '@pages/shared/shared.module';
import { DetailComponent } from './detail.component';
import { DocumentMetadataInfoComponent } from './document-metadata-info/document-metadata-info.component';
import { DocumentAdditionalInfoComponent } from './document-additional-info/document-additional-info.component';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    NbAccordionModule,
  ],
  declarations: [
    DetailComponent,
    DocumentMetadataInfoComponent,
    DocumentAdditionalInfoComponent,
  ],
  providers: [
    SharedModule.forRoot().providers,
  ],
})
export class DetailPageModule { }
