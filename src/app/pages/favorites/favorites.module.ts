import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { AllFavoritesModule } from './home/all-favorites/all-favorites.module';
import { FavoritesRoutingModule } from './favorites-routing.module';
import { FavoritesComponent } from './favorites.component';
@NgModule({
    imports: [
      ThemeModule,
      AllFavoritesModule,
      FavoritesRoutingModule,
    ],
    declarations: [
      FavoritesComponent,
    ],
  })
export class FavoritesModule { }

