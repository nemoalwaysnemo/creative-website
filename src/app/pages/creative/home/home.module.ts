import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@pages/shared/shared.module';
import { HomeComponent } from './home.component';
import { AgencyThumbnailComponent } from './agency-thumbnail/agency-thumbnail.component';
import { BrandThumbnailComponent } from './brand-thumbnail/brand-thumbnail.component';
import { HomeGalleryComponent } from './home-gallery/home-gallery.component';
import { RouterModule } from '@angular/router';
import { RecommendedBrandThumbnailComponent } from './recommended-brand-thumbnail/recommended-brand-thumbnail.component';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    RouterModule,
  ],
  declarations: [
    HomeComponent,
    HomeGalleryComponent,
    AgencyThumbnailComponent,
    BrandThumbnailComponent,
    RecommendedBrandThumbnailComponent,
  ],
})
export class HomePageModule { }
