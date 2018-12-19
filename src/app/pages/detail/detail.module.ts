import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@pages/shared/shared.module';
import { DetailComponent } from './detail.component';
import { DocumentMetadataInfoComponent } from './document-metadata-info/document-metadata-info.component';
import { NbAccordionModule } from '@core/nebular/theme';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    NbAccordionModule,
  ],
  declarations: [
    DetailComponent,
    DocumentMetadataInfoComponent,
  ],
  providers: [
    SharedModule.forRoot().providers,
  ],
})
export class DetailPageModule { }
