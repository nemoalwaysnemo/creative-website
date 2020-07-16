import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@pages/shared/shared.module';
import { BackslashHomeComponent } from './backslash-home.component';
import { BackslashHomeThumbnailComponent } from './backslash-home-thumbnail/backslash-home-thumbnail.component';
import { BackslashHomeGalleryComponent } from './backslash-home-gallery/backslash-home-gallery.component';
import { GlobalSearchFormModule, GlobalSearchResultModule } from '@pages/shared';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    RouterModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
  ],
  declarations: [
    BackslashHomeComponent,
    BackslashHomeGalleryComponent,
    BackslashHomeThumbnailComponent,
  ],
})
export class BackslashHomeModule { }
