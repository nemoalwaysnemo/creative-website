import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { IntelligencePageComponent } from './intelligence-page.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [{
  path: '',
  component: IntelligencePageComponent,
  children: [
    {
      path: 'home',
      component: HomeComponent,
    },
    {
      path: '',
      component: HomeComponent,
      pathMatch: 'full',
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IntelligencePageRoutingModule {
}
