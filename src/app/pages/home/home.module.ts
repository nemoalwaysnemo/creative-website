import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { HomeComponent } from './home.component';
import { ThumbnailViewModule } from '@pages/shared/thumbnail-view/thumbnail-view.module';
import { ImageGalleryModule } from '@pages/shared/image-gallery/image-gallery.module';
import { AgencyThumbnailComponent } from './agency-thumbnail/agency-thumbnail.component';

@NgModule({
  imports: [
    ThemeModule,
    ThumbnailViewModule,
    ImageGalleryModule,
  ],
  declarations: [
    HomeComponent,
    AgencyThumbnailComponent,
  ],
})
export class HomeModule { }
