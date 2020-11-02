import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DragScrollModule } from 'ngx-drag-scroll';
import { GalleryUploadComponent } from './gallery-upload.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DragScrollModule,
  ],
  exports: [
    GalleryUploadComponent,
  ],
  declarations: [
    GalleryUploadComponent,
  ],
})
export class GalleryUploadModule {

}
