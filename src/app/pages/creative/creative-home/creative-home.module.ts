import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@pages/shared/shared.module';
import { CreativeHomeComponent } from './creative-home.component';
import { AgencyThumbnailComponent } from './agency-thumbnail/agency-thumbnail.component';
import { CreativeHomeGalleryComponent } from './creative-home-gallery/creative-home-gallery.component';
import { RecommendedBrandThumbnailComponent } from './recommended-brand-thumbnail/recommended-brand-thumbnail.component';
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
    AgencyThumbnailComponent,
    RecommendedBrandThumbnailComponent,
  ],
})
export class CreativeHomePageModule { }
