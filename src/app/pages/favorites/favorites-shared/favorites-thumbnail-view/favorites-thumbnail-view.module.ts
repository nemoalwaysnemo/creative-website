import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FavoritesThumbnailViewComponent } from './favorites-thumbnail-view.component';
import { PaginationModule } from 'app/pages/shared/pagination/pagination.module';
@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    PaginationModule,
    RouterModule,
  ],
  declarations: [
    FavoritesThumbnailViewComponent,
  ], exports: [
    FavoritesThumbnailViewComponent,
  ],
})

export class FavoritesThumbnailViewModule {

}
