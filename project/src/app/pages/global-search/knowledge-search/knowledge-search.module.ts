import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { GlobalSearchFormModule, GlobalSearchResultModule } from '@pages/shared';
import { KnowledgeSearchComponent } from './knowledge-search.component';
import { KnowledgeSearchRoutingModule } from './knowledge-search-routing.module';
import { KnowledgeDocumentAssetSearchComponent } from './knowledge-document-asset-search/knowledge-document-asset-search.component';
import { GlobalSearchButtonModule } from '../../shared/global-search-button/global-search-button.module';

@NgModule({
  imports: [
    ThemeModule,
    CommonModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    GlobalSearchButtonModule,
    KnowledgeSearchRoutingModule,
  ],
  declarations: [
    KnowledgeSearchComponent,
    KnowledgeDocumentAssetSearchComponent,
  ],
})
export class KnowledgeSearchModule {
}
