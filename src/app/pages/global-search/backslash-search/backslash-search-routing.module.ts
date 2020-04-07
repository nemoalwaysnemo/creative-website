import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { BackslashSearchComponent } from './backslash-search.component';
import { BackslashDocumentAssetSearchComponent } from './backslash-document-asset-search/backslash-document-asset-search.component';

const routes: Routes = [{
  path: '',
  component: BackslashSearchComponent,
  children: [
    {
      path: 'asset',
      component: BackslashDocumentAssetSearchComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BackslashSearchRoutingModule {
}
