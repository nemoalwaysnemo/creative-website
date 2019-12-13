import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CreativeBrandPageComponent } from './creative-brand-page.component';
import { CreativeBrandShowcaseComponent } from './creative-brand-showcase/creative-brand-showcase.component';
import { CreativeBrandUsageRightsComponent } from './creative-brand-usage-rights/creative-brand-usage-rights.component';
import { CreativeBrandListManageComponent } from './creative-brand-list-manage/creative-brand-list-manage.component';
import { CreativeBrandLibraryManageComponent } from './creative-brand-library-manage/creative-brand-library-manage.component';
const routes: Routes = [{
  path: '',
  component: CreativeBrandPageComponent,
  children: [
    {
      path: ':id/showcase',
      component: CreativeBrandShowcaseComponent,
    },
    {
      path: ':id/usageRights',
      component: CreativeBrandUsageRightsComponent,
    },
    {
      path: ':id/folder',
      component: CreativeBrandListManageComponent,
    },
    {
      path: ':id/library',
      component: CreativeBrandLibraryManageComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreativeBrandPageRoutingModule {
}
