import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { HomeComponent } from './home.component';
import { ThumbnailViewModule } from '@pages/shared/thumbnail-view/thumbnail-view.module';
import { ImageGalleryModule } from '@pages/shared/image-gallery/image-gallery.module';
import { PictureGalleryModule } from '@pages/shared/picture-gallery/picture-gallery.module';
import { AgencyThumbnailComponent } from './agency-thumbnail/agency-thumbnail.component';
import { BrandThumbnailComponent } from './brand-thumbnail/brand-thumbnail.component';
import { TbwaHomeGalleryComponent } from './home-gallery/home-gallery.component';
import { HomeSearchModule } from '@pages/shared/home-search/home-search.module';
@NgModule({
  imports: [
    ThemeModule,
    ThumbnailViewModule.forRoot(),
    HomeSearchModule,
    PictureGalleryModule,
  ],
  declarations: [
    HomeComponent,
    AgencyThumbnailComponent,
    BrandThumbnailComponent,
    TbwaHomeGalleryComponent,
  ],
})
export class HomePageModule { }
