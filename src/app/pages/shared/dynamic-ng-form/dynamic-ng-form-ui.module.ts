import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BatchFileUploadModule } from '../batch-file-upload/batch-file-upload.module';
import { DynamicNGBatchUploadComponent } from './batch-upload/dynamic-ng-batch-upload.component';
import { DynamicFormsBaseNGUIModule } from './dynamic-ng-form-base-ui.module';
import { DynamicNGDragDropFileZoneComponent } from './drag-drop-file-zone/dynamic-ng-drag-drop-file-zone.component';

@NgModule({
  imports: [
    DynamicFormsBaseNGUIModule,
    CommonModule,
    ReactiveFormsModule,
    BatchFileUploadModule,
  ],
  declarations: [
    DynamicNGBatchUploadComponent,
    DynamicNGDragDropFileZoneComponent,
  ],
  entryComponents: [
    DynamicNGBatchUploadComponent,
    DynamicNGDragDropFileZoneComponent,
  ],
  exports: [
    DynamicNGBatchUploadComponent,
    DynamicNGDragDropFileZoneComponent,
    DynamicFormsBaseNGUIModule,
  ],
})
export class DynamicFormsNGUIModule {

}
