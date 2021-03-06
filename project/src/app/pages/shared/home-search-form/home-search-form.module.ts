import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClickOutsideModule } from 'ng-click-outside';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeSearchFormComponent } from './home-search-form.component';
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
})
export class HomeSearchFormModule {

}
