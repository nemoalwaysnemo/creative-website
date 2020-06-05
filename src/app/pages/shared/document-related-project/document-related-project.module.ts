import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocumentRelatedProjectComponent } from './document-related-project.component';
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
    DocumentRelatedProjectComponent,
  ],
  exports: [
    DocumentRelatedProjectComponent,
  ],
})
export class DocumentRelatedProjectModule {
}
