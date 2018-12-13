import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PictureGalleryComponent } from './picture-gallery.component';
import { PictureGalleryDataSource } from './picture-gallery-data-source.service';
import { GalleryModule } from '@ngx-gallery/core';

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
  ],
})
export class PictureGalleryModule {

}
