import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { HomeComponent } from './home.component';
import { HumorComponent } from './humor/humor.component';
import { ThumbnailViewModule } from '@pages/shared/thumbnail-view/thumbnail-view.module';
import { ImgGalleryModule } from '@pages/shared/img-gallery/img-gallery.module';

@NgModule({
  imports: [
    ThemeModule,
    ThumbnailViewModule,
    ImgGalleryModule,
  ],
  declarations: [
    HomeComponent,
    HumorComponent,
  ],
})
export class HomeModule { }
