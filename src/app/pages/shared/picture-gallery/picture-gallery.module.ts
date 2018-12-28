import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PictureGalleryComponent } from './picture-gallery.component';
import { GalleryModule } from '@core/custom/ngx-gallery/core/public_api';
import { GALLERY_CONFIG } from '@core/custom/ngx-gallery/core/public_api';

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
        loadingMode: 'indeterminate',
      },
    },
  ],
})
export class PictureGalleryModule {

}
