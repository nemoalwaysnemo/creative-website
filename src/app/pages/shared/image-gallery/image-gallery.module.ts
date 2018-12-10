import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageGalleryComponent } from './image-gallery.component';
import { NgxGalleryModule } from '@core/custom/ngx-gallery';
@NgModule({
  imports: [
    CommonModule,
    NgxGalleryModule,
  ],
  exports: [
    ImageGalleryComponent,
  ],
  declarations: [
    ImageGalleryComponent,
  ],
})
export class ImageGalleryModule {

}
