import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PictureGalleryComponent } from './picture-gallery.component';
import { PictureGalleryDataSource } from './picture-gallery-data-source.service';
import { GalleryModule } from '@ngx-gallery/core';
import { GALLERY_CONFIG } from '@ngx-gallery/core';

@NgModule({
  imports: [
    CommonModule,
    GalleryModule,
  ],
  exports: [
    PictureGalleryComponent,
  ],
  declarations: [
    PictureGalleryComponent,
  ],
  providers: [
    PictureGalleryDataSource,
     {
      provide: GALLERY_CONFIG,
      useValue: {
        autoPlay: true,
        dots: false,
      },
    },
  ],
})
export class PictureGalleryModule {

}
