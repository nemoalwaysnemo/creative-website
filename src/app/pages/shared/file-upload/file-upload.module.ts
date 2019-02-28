import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgfModule } from '@core/custom';
import { APIModule } from '@core/api';
import { FileUploadComponent } from './file-upload.component';
import { ThemeModule } from '@theme/theme.module';

@NgModule({
  imports: [
    APIModule,
    NgfModule,
    ThemeModule,
    CommonModule,
  ],
  declarations: [FileUploadComponent],
  exports: [
    FileUploadComponent,
  ],
})

export class FileUploadModule {

}
