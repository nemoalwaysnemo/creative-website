import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { GlobalSearchFormModule, GlobalSearchResultModule } from '@pages/shared';
import { KnowledgeSearchComponent } from './knowledge-search.component';
import { KnowledgeSearchRoutingModule } from './knowledge-search-routing.module';
import { KnowledgeDocumentAssetSearchComponent } from './knowledge-document-asset-search/knowledge-asset-search.component';

@NgModule({
  imports: [
    ThemeModule,
    CommonModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    KnowledgeSearchRoutingModule,
  ],
  declarations: [
    KnowledgeSearchComponent,
    KnowledgeDocumentAssetSearchComponent,
  ],
})
export class KnowledgeSearchModule {
}
