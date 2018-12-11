import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { HomeModule } from './home/home.module';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { ThumbnailViewModule, ImageGalleryModule } from './shared';

const PAGES_COMPONENTS = [
  PagesComponent,
];

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    HomeModule,
    MiscellaneousModule,
    ThumbnailViewModule.forRoot(),
    ImageGalleryModule,
  ],
  declarations: [
    ...PAGES_COMPONENTS,
  ],
})
export class PagesModule {
}
