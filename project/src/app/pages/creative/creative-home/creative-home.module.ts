import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@pages/shared/shared.module';
import { CreativeHomeComponent } from './creative-home.component';
import { CreativeBestShowcaseComponent } from './creative-best-showcase/creative-best-showcase.component';
import { CreativeHomeGalleryComponent } from './creative-home-gallery/creative-home-gallery.component';
import { PopularBrandThumbnailComponent } from './popular-brand-thumbnail/popular-brand-thumbnail.component';
import { CreativeMyAgencyActionComponent } from './creative-my-agency-action/creative-my-agency-action.component';
import { DocumentThumbnailViewModule } from '@pages/shared/document-thumbnail-view/document-thumbnail-view.module';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    RouterModule,
    DocumentThumbnailViewModule,
  ],
  declarations: [
    CreativeHomeComponent,
    CreativeHomeGalleryComponent,
    CreativeBestShowcaseComponent,
    CreativeMyAgencyActionComponent,
    PopularBrandThumbnailComponent,
  ],
})
export class CreativeHomeModule { }
