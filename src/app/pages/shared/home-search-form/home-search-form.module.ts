import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdvanceSearch } from '@core/api';
import { HomeSearchFormComponent } from './home-search-form.component';
import { ClickOutsideModule } from 'ng-click-outside';
import { DocumentThumbnailViewModule } from '../document-thumbnail-view/document-thumbnail-view.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ClickOutsideModule,
    DocumentThumbnailViewModule,
  ],
  declarations: [
    HomeSearchFormComponent,
  ],
  exports: [
    HomeSearchFormComponent,
  ],
  providers: [
    AdvanceSearch,
  ],
})
export class HomeSearchFormModule {

}
