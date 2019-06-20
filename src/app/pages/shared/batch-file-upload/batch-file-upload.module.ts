import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgFileModule } from '@core/custom';
import { APIModule } from '@core/api';
import { BatchFileUploadComponent } from './batch-file-upload.component';
import { ThemeModule } from '@theme/theme.module';
import { DynamicFormsBaseNGUIModule } from '@pages/shared/dynamic-ng-form/dynamic-ng-form-base-ui.module';
import { AttachmentUploadComponent } from './attachment-upload.component';

@NgModule({
  imports: [
    APIModule,
    NgFileModule,
    FormsModule,
    ThemeModule,
    CommonModule,
    DynamicFormsBaseNGUIModule,
  ],
  declarations: [
    BatchFileUploadComponent,
    AttachmentUploadComponent,
  ],
  exports: [
    BatchFileUploadComponent,
    AttachmentUploadComponent,
  ],
})

export class BatchFileUploadModule {

}
