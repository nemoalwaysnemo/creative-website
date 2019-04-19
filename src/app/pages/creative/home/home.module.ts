import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@pages/shared/shared.module';
import { HomeComponent } from './home.component';
import { AgencyThumbnailComponent } from './agency-thumbnail/agency-thumbnail.component';
import { HomeGalleryComponent } from './home-gallery/home-gallery.component';
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
    HomeComponent,
    HomeGalleryComponent,
    AgencyThumbnailComponent,
    RecommendedBrandThumbnailComponent,
  ],
})
export class HomePageModule { }
