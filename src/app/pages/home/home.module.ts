import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { HomeComponent } from './home.component';
import { ThumbnailViewModule } from '@pages/shared/thumbnail-view/thumbnail-view.module';

@NgModule({
  imports: [
    ThemeModule,
    ThumbnailViewModule,
  ],
  declarations: [
    HomeComponent,
  ],
})
export class HomeModule { }
