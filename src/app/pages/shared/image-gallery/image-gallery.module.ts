import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageGalleryComponent } from './image-gallery.component';
import { NgxGalleryModule } from '@core/custom/ngx-gallery';
import { ImageGalleryDataSource } from './image-gallery-data-source.service';
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
  providers: [
    ImageGalleryDataSource,
  ],
})
export class ImageGalleryModule {

}
