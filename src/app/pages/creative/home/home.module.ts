import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home.component';
import { HomeSearchModule } from './home-search/home-search.module';
import { AgencyThumbnailComponent } from './agency-thumbnail/agency-thumbnail.component';
import { BrandThumbnailComponent } from './brand-thumbnail/brand-thumbnail.component';
import { HomeGalleryComponent } from './home-gallery/home-gallery.component';


@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    HomeSearchModule,
  ],
  declarations: [
    HomeComponent,
    HomeGalleryComponent,
    AgencyThumbnailComponent,
    BrandThumbnailComponent,
  ],
  providers: [
    SharedModule.forRoot().providers,
  ],
})
export class HomePageModule { }
