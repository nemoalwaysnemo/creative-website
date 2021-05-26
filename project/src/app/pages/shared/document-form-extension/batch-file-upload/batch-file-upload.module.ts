import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgFileModule } from '@core/custom';
import { APIModule } from '@core/api';
import { ThemeModule } from '@theme/theme.module';
import { NbSpinnerModule } from '@core/nebular/theme';
import { BatchFileUploadComponent } from './batch-file-upload.component';
import { DragDropFileZoneModule } from '../drag-drop-file-zone/drag-drop-file-zone.module';
import { DynamicFormsBaseNGUIModule } from '../dynamic-ng-form/dynamic-ng-form-base-ui.module';

@NgModule({
  imports: [
    APIModule,
    NgFileModule,
    FormsModule,
    ThemeModule,
    CommonModule,
    NbSpinnerModule,
    DragDropFileZoneModule,
    DynamicFormsBaseNGUIModule,
  ],
  declarations: [
    BatchFileUploadComponent,
  ],
  exports: [
    BatchFileUploadComponent,
  ],
})

export class BatchFileUploadModule {
}
