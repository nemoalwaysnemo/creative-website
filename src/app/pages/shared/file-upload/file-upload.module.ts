import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileDropModule } from 'ngx-file-drop';
import { APIModule } from '@core/api';
import { FileUploadComponent } from './file-upload.component';

@NgModule({
  imports: [
    APIModule,
    CommonModule,
    FileDropModule,
  ],
  declarations: [FileUploadComponent],
  exports: [
    FileUploadComponent,
  ],
})

export class FileUploadModule {

}
