import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { FavoritesComponent } from './favorites.component';
import { AllFavoritesComponent } from '../favorites/home/all-favorites/all-favorites.component';
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
    ],
  }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class FavoritesRoutingModule {
}
