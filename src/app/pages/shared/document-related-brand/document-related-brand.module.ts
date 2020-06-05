import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocumentRelatedBrandComponent } from './document-related-brand.component';
import { GlobalSearchFormModule } from '../global-search-form/global-search-form.module';
import { GlobalSearchResultModule } from '../global-search-result/global-search-result.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
  ],
  declarations: [
    DocumentRelatedBrandComponent,
  ],
  exports: [
    DocumentRelatedBrandComponent,
  ],
})
export class DocumentRelatedBrandModule {
}
