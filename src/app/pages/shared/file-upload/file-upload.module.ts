import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadComponent } from './file-upload.component';
import { FileUploadService } from '@core/api/api.file-upload.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [FileUploadComponent],
  exports: [
    FileUploadComponent,
  ],
  providers: [
    FileUploadService,
  ],
})

export class FileUploadModule {

}
