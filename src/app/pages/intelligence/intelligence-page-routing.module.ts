import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { IntelligencePageComponent } from './intelligence-page.component';
import { IntelligenceHomeComponent } from './intelligence-home/intelligence-home.component';
import { IntelligenceFolderComponent } from './intelligence-folder/intelligence-folder.component';
import { IntelligenceAssetComponent } from './intelligence-asset/intelligence-asset.component';

const routes: Routes = [{
  path: '',
  component: IntelligencePageComponent,
  children: [
    {
      path: 'home',
      component: IntelligenceHomeComponent,
    },
    {
      path: '',
      component: IntelligenceHomeComponent,
      pathMatch: 'full',
    },
    {
      path: 'folder/:id',
      component: IntelligenceFolderComponent,
    },
    {
      path: 'asset/:id',
      component: IntelligenceAssetComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IntelligencePageRoutingModule {
}
