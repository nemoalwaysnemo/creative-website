import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { DocumentRelatedInfoComponent } from './document-related-info.component';
import { DocumentRelatedInfoViewModule } from './document-related-info-view/document-related-info-view.module';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    DocumentRelatedInfoViewModule,
  ],
  declarations: [
    DocumentRelatedInfoComponent,
  ],
  exports: [
    DocumentRelatedInfoComponent,
  ],
})
export class DocumentRelatedInfoModule {
}
