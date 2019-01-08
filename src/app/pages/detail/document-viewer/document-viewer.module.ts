import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentPdfViewerComponent } from './document-pdf-viewer/document-pdf-viewer.component';
import { DocumentImageViewerComponent } from './document-image-viewer/document-image-viewer.component';
import { SimplePdfViewerModule } from 'simple-pdf-viewer';
import { ImageViewerModule } from 'ngx-image-viewer';
import { ThemeModule } from '@theme/theme.module';
import { DocumentViewerComponent } from '@pages/detail/document-viewer/document-viewer.component';

@NgModule({
  imports: [
    ThemeModule,
    CommonModule,
    SimplePdfViewerModule,
    ImageViewerModule,
  ],
  declarations: [
    DocumentPdfViewerComponent,
    DocumentImageViewerComponent,
    DocumentViewerComponent,
  ],
  exports: [
    DocumentViewerComponent,
  ],
})
export class DocumentViewerModule {
}
