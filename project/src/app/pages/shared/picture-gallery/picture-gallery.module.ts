import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PictureGalleryComponent } from './picture-gallery.component';
import { GalleryModule, GALLERY_CONFIG } from '@core/custom/ngx-gallery/core/index';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    GalleryModule,
    RouterModule,
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
      },
    },
  ],
})
export class PictureGalleryModule {

}
