import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdvanceSearchComponent } from './advance-search.component';
import { ThumbnailViewModule } from '@pages/shared/thumbnail-view/thumbnail-view.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ThumbnailViewModule,
  ],
  exports: [
    AdvanceSearchComponent,
  ],
  declarations: [
    AdvanceSearchComponent,
  ],
})
export class AdvanceSearchModule { }
