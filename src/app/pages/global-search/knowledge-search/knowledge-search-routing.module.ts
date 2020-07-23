import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { KnowledgeSearchComponent } from './knowledge-search.component';
import { KnowledgeDocumentAssetSearchComponent } from './knowledge-document-asset-search/knowledge-document-asset-search.component';

const routes: Routes = [{
  path: '',
  component: KnowledgeSearchComponent,
  children: [
    {
      path: 'asset',
      component: KnowledgeDocumentAssetSearchComponent,
    },
    {
      path: '',
      redirectTo: 'asset',
      pathMatch: 'full',
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KnowledgeSearchRoutingModule {
}
