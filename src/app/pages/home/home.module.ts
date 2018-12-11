import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { HomeComponent } from './home.component';
import { ThumbnailViewModule } from '@pages/shared/thumbnail-view/thumbnail-view.module';
import { ImageGalleryModule } from '@pages/shared/image-gallery/image-gallery.module';
import { AgencyThumbnailComponent } from './agency-thumbnail/agency-thumbnail.component';
import { HomeSearchModule } from '@pages/shared/home-search/home-search.module';

@NgModule({
  imports: [
    ThemeModule,
    ThumbnailViewModule,
    ImageGalleryModule,
    HomeSearchModule,
  ],
  declarations: [
    HomeComponent,
    AgencyThumbnailComponent,
  ],
})
export class HomeModule { }
