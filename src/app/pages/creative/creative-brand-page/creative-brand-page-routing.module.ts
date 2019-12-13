import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CreativeBrandPageComponent } from './creative-brand-page.component';
import { CreativeBrandShowcaseComponent } from './creative-brand-showcase/creative-brand-showcase.component';
import { CreativeBrandUsageRightsComponent } from './creative-brand-usage-rights/creative-brand-usage-rights.component';

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
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreativeBrandPageRoutingModule {
}
