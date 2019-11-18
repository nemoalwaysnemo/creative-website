import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { FavoritePageComponent } from './favorite-page.component';
import { AllFavoritesComponent } from './all-favorites/all-favorites.component';
import { FavoriteBackslashComponent } from './favorite-backslash/favorite-backslash.component';
import { FavoriteBrandComponent } from './favorite-brand/favorite-brand.component';
import { FavoriteDisruptionComponent } from './favorite-disruption/favorite-disruption.component';

const routes: Routes = [{
  path: '',
  component: FavoritePageComponent,
  children: [
    {
      path: 'all',
      component: AllFavoritesComponent,
    },
    {
      path: 'brand',
      component: FavoriteBrandComponent,
    },
    {
      path: 'backslash',
      component: FavoriteBackslashComponent,
    },
    {
      path: 'disruption',
      component: FavoriteDisruptionComponent,
    },
    {
      path: '',
      redirectTo: 'all',
      pathMatch: 'full',
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FavoritePageRoutingModule {
}
