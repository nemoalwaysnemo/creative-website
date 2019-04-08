import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { FavoritesComponent } from './favorites.component';
import { AllFavoritesComponent } from './home/all-favorites/all-favorites.component';
import { MyBackslashComponent } from './home/my-backslash/my-backslash.component';
import { MyBrandsComponent } from './home/my-brands/my-brands.component';
import { MyDisruptionComponent } from './home/my-disruption/my-disruption.component';
const routes: Routes = [{
    path: '',
    component: FavoritesComponent,
    children: [
        {
          path: '',
          redirectTo: 'all',
          pathMatch: 'full',
        },
        {
          path: 'all',
          component: AllFavoritesComponent,
        },
        {
          path: 'brands',
          component: MyBrandsComponent,
        },
        {
          path: 'backslash',
          component: MyBackslashComponent,
        },
        {
          path: 'disruption',
          component: MyDisruptionComponent,
        },
    ],
  }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class FavoritesRoutingModule {
}
