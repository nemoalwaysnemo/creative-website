import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { HomeComponent } from './home.component';
import { ThumbnailViewModule } from '@pages/shared/thumbnail-view/thumbnail-view.module';
import { PictureGalleryModule } from '@pages/shared/picture-gallery/picture-gallery.module';
import { AgencyThumbnailComponent } from './agency-thumbnail/agency-thumbnail.component';
import { BrandThumbnailComponent } from './brand-thumbnail/brand-thumbnail.component';
import { HomeGalleryComponent } from './home-gallery/home-gallery.component';
import { AdvanceSearchModule } from '@pages/shared/advance-search/advance-search.module';

@NgModule({
  imports: [
    ThemeModule,
    ThumbnailViewModule.forRoot(),
    AdvanceSearchModule,
    PictureGalleryModule,
  ],
  declarations: [
    HomeComponent,
    AgencyThumbnailComponent,
    BrandThumbnailComponent,
    HomeGalleryComponent,
  ],
})
export class HomePageModule { }
