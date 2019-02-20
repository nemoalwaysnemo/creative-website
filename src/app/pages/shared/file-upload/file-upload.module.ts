import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadComponent } from './file-upload.component';
import { BatchUploadService } from '@core/api/api.batch-upload.service';

@NgModule({
  imports: [
    CommonModule,
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
