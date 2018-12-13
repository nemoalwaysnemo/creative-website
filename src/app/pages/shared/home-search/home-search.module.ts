import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeSearchComponent } from './home-search.component';
import { ThumbnailViewModule } from '@pages/shared/thumbnail-view/thumbnail-view.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ThumbnailViewModule,
  ],
  exports: [
    HomeSearchComponent,
  ],
  declarations: [
    HomeSearchComponent,
  ],
})
export class HomeSearchModule {}
