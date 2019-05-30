import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgfModule } from '@core/custom';
import { APIModule } from '@core/api';
import { BatchFileUploadComponent } from './batch-file-upload.component';
import { ThemeModule } from '@theme/theme.module';
import { DynamicFormsBaseNGUIModule } from '@pages/shared/dynamic-ng-form/dynamic-ng-form-base-ui.module';

@NgModule({
  imports: [
    APIModule,
    NgfModule,
    FormsModule,
    ThemeModule,
    CommonModule,
    DynamicFormsBaseNGUIModule,
  ],
  declarations: [BatchFileUploadComponent],
  exports: [
    BatchFileUploadComponent,
  ],
})

export class BatchFileUploadModule {

}
