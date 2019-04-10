import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { IntelligenceSearchComponent } from './intelligence-search.component';
import { IntelligenceAssetSearchComponent } from './intelligence-asset-search/intelligence-asset-search.component';

const routes: Routes = [{
  path: '',
  component: IntelligenceSearchComponent,
  children: [
    {
      path: 'asset',
      component: IntelligenceAssetSearchComponent,
    },
    {
      path: '',
      component: IntelligenceAssetSearchComponent,
      pathMatch: 'full',
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IntelligenceSearchRoutingModule {
}
