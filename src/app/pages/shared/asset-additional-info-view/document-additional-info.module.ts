import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { DocumentAdditionalInfoComponent } from './document-additional-info.component';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
  ],
  declarations: [
    DocumentAdditionalInfoComponent,
  ],
  exports: [
    DocumentAdditionalInfoComponent,
  ],
})
export class DocumentAdditionalInfoModule {
}
