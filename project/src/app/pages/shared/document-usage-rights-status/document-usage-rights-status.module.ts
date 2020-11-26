import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { DocumentUsageRightsStatusComponent } from './document-usage-rights-status.component';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
  ],
  exports: [
    DocumentUsageRightsStatusComponent,
  ],
  declarations: [
    DocumentUsageRightsStatusComponent,
  ],
})
export class DocumentUsageRightsStatusModule { }
