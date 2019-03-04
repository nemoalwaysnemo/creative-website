import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { DocumentMetadataInfoComponent } from './document-metadata-info.component';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
  ],
  declarations: [
    DocumentMetadataInfoComponent,
  ],
  exports: [
    DocumentMetadataInfoComponent,
  ],
})
export class DocumentMetadataInfoModule {
}
