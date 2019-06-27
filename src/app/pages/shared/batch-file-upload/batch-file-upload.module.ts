import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgFileModule } from '@core/custom';
import { APIModule } from '@core/api';
import { BatchFileUploadComponent } from './batch-file-upload.component';
import { ThemeModule } from '@theme/theme.module';
import { DynamicFormsBaseNGUIModule } from '../dynamic-ng-form/dynamic-ng-form-base-ui.module';
import { AttachmentUploadComponent } from './attachment-upload.component';
import { DragDropFileZoneComponent } from './drag-drop-file-zone.component';
import { DragDropFileZoneService } from './drag-drop-file-zone.service';

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
    DragDropFileZoneComponent,
  ],
  providers: [
    DragDropFileZoneService,
  ],
  exports: [
    BatchFileUploadComponent,
    AttachmentUploadComponent,
    DragDropFileZoneComponent,
  ],
})

export class BatchFileUploadModule {
}
