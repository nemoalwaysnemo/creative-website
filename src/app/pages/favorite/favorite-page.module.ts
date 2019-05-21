import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { AllFavoritesModule } from './all-favorites/all-favorites.module';
import { FavoritePageRoutingModule } from './favorite-page-routing.module';
import { FavoritePageComponent } from './favorite-page.component';
import { FavoriteBackslashModule } from './favorite-backslash/favorite-backslash.module';
import { FavoriteBrandModule } from './favorite-brand/favorite-brand.module';
import { FavoriteDisruptionModule } from './favorite-disruption/favorite-disruption.module';

@NgModule({
  imports: [
    ThemeModule,
    AllFavoritesModule,
    FavoritePageRoutingModule,
    FavoriteBackslashModule,
    FavoriteBrandModule,
    FavoriteDisruptionModule,
  ],
  declarations: [
    FavoritePageComponent,
  ],
})
export class FavoritePageModule { }
