import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { AllFavoritesModule } from './home/all-favorites/all-favorites.module';
import { FavoritesRoutingModule } from './favorites-routing.module';
import { FavoritesComponent } from './favorites.component';
import { MyBackslashModule } from './home/my-backslash/my-backslash.module';
import { MyBrandsModule } from './home/my-brands/my-brands.module';
import { MyDisruptionModule } from './home/my-disruption/my-disruption.module';
@NgModule({
    imports: [
      ThemeModule,
      AllFavoritesModule,
      FavoritesRoutingModule,
      MyBackslashModule,
      MyBrandsModule,
      MyDisruptionModule,
    ],
    declarations: [
      FavoritesComponent,
    ],
  })
export class FavoritesModule { }

