import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { BusinessDevelopmentSearchComponent } from './business-development-search.component';
import { BizDevDocumentAssetSearchComponent } from './biz-dev-document-asset-search/biz-dev-document-asset-search.component';

const routes: Routes = [{
  path: '',
  component: BusinessDevelopmentSearchComponent,
  children: [
    {
      path: 'asset',
      component: BizDevDocumentAssetSearchComponent,
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
export class BusinessDevelopmentSearchRoutingModule {
}
