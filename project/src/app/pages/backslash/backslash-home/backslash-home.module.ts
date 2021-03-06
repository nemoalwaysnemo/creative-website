import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@pages/shared/shared.module';
import { BackslashHomeComponent } from './backslash-home.component';
import { GlobalSearchFormModule, GlobalSearchResultModule } from '@pages/shared';
import { BackslashFormButtonModule } from '../backslash-form-button/backslash-form-button.module';
import { BackslashHomeThumbnailComponent } from './backslash-home-thumbnail/backslash-home-thumbnail.component';
import { BackslashHomeGalleryComponent } from './backslash-home-gallery/backslash-home-gallery.component';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    BackslashFormButtonModule,
  ],
  declarations: [
    BackslashHomeComponent,
    BackslashHomeGalleryComponent,
    BackslashHomeThumbnailComponent,
  ],
})
export class BackslashHomeModule { }
