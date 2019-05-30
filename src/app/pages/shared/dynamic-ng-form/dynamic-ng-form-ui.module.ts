import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BatchFileUploadModule } from '../batch-file-upload/batch-file-upload.module';
import { DynamicNGBatchUploadComponent } from './batch-upload/dynamic-ng-batch-upload.component';
import { DynamicFormsBaseNGUIModule } from './dynamic-ng-form-base-ui.module';


@NgModule({
  imports: [
    DynamicFormsBaseNGUIModule,
    CommonModule,
    ReactiveFormsModule,
    BatchFileUploadModule,
  ],
  declarations: [
    DynamicNGBatchUploadComponent,
  ],
  entryComponents: [
    DynamicNGBatchUploadComponent,
  ],
  exports: [
    DynamicNGBatchUploadComponent,
    DynamicFormsBaseNGUIModule,
  ],
})
export class DynamicFormsNGUIModule {
}
