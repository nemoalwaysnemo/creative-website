import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CreativeHomeComponent } from './creative-home/creative-home.component';
import { CreativeAssetComponent } from './creative-asset/creative-asset.component';
import { CreativePageComponent } from './creative-page.component';
import { FolderManageComponent } from './folder-manage/folder-manage.component';
import { LibraryManageComponent } from './library-manage/library-manage.component';
import { CreativeBrandComponent } from './creative-brand/creative-brand.component';
const routes: Routes = [{
  path: '',
  component: CreativePageComponent,
  children: [
    {
      path: 'home',
      component: CreativeHomeComponent,
    },
    {
      path: 'asset/:id',
      component: CreativeAssetComponent,
    },
    {
      path: 'brand/:id/showcase',
      component: CreativeBrandComponent,
    },
    {
      path: 'brand/:id',
      component: CreativeBrandComponent,
    },
    {
      path: ':type/:id/folder',
      component: FolderManageComponent,
    },
    {
      path: ':type/:id/library',
      component: LibraryManageComponent,
    },
    {
      path: '',
      redirectTo: 'home',
      pathMatch: 'full',
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreativePageRoutingModule {
}
