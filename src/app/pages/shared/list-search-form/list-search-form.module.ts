import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NbSpinnerModule } from '@core/nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListSearchFormComponent } from './list-search-form.component';
import { SharedDirectiveModule } from '../directives/shared-directive.module';
import { DocumentListViewModule } from '../document-list-view/document-list-view.module';
import { GlobalSearchFilterModule } from '../global-search-filter/global-search-filter.module';
import { ListSearchRowCustomViewComponent } from './list-search-row-custom-view-component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NbSpinnerModule,
    ReactiveFormsModule,
    SharedDirectiveModule,
    DocumentListViewModule,
    GlobalSearchFilterModule,
  ],
  declarations: [
    ListSearchFormComponent,
    ListSearchRowCustomViewComponent,
  ],
  entryComponents: [
    ListSearchRowCustomViewComponent,
  ],
  exports: [
    ListSearchFormComponent,
  ],
})
export class ListSearchFormModule {

}
