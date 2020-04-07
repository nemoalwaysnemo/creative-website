import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdvanceSearch } from '@core/api';
import { HomeSearchFormComponent } from './home-search-form.component';
import { ClickOutsideModule } from 'ng-click-outside';
import { DocumentThumbnailViewModule } from '../document-thumbnail-view/document-thumbnail-view.module';
import { GlobalSearchFilterModule } from '../global-search-filter/global-search-filter.module';
import { SharedDirectiveModule } from '../directives/shared-directive.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ClickOutsideModule,
    DocumentThumbnailViewModule,
    GlobalSearchFilterModule,
    SharedDirectiveModule,
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
