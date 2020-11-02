import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DisruptionSearchComponent } from './disruption-search.component';
import { DisruptionDocumentAssetSearchComponent } from './disruption-document-asset-search/disruption-document-asset-search.component';

const routes: Routes = [{
  path: '',
  component: DisruptionSearchComponent,
  children: [
    {
      path: 'asset',
      component: DisruptionDocumentAssetSearchComponent,
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
export class DisruptionSearchRoutingModule {
}
