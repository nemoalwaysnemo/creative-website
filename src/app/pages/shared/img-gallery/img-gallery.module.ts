import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImgGalleryComponent } from './img-gallery.component';
import { NgxGalleryModule } from '@core/custom/ngx-gallery';
@NgModule({
  imports: [
   CommonModule,
   NgxGalleryModule,
  ],
  exports: [
    ImgGalleryComponent,
  ],
  declarations: [
    ImgGalleryComponent,
  ],
})
export class ImgGalleryModule {

}
