import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PictureGalleryComponent } from './picture-gallery.component';
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
    {
      provide: GALLERY_CONFIG,
      useValue: {
        autoPlay: false,
        dots: false,
        nav: false,
      },
    },
  ],
})
export class PictureGalleryModule {

}
