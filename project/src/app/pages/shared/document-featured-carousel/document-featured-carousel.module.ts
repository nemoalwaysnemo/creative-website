import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PictureGalleryModule } from '../picture-gallery/picture-gallery.module';
import { DocumentFeaturedCarouselComponent } from './document-featured-carousel.component';

@NgModule({
  imports: [
    CommonModule,
    PictureGalleryModule,
  ],
  declarations: [
    DocumentFeaturedCarouselComponent,
  ],
  exports: [
    DocumentFeaturedCarouselComponent,
  ],
})
export class DocumentFeaturedCarouselModule {

}
