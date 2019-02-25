import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileDropModule } from 'ngx-file-drop';
import { FileUploadComponent } from './file-upload.component';
import { BatchUploadService } from '@core/api/api.batch-upload.service';

@NgModule({
  imports: [
    CommonModule,
    FileDropModule,
  ],
  declarations: [FileUploadComponent],
  exports: [
    FileUploadComponent,
  ],
  providers: [
    BatchUploadService,
  ],
})

export class FileUploadModule {

}
