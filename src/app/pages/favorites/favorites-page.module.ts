import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { AllFavoritesModule } from './all-favorites/all-favorites.module';
import { FavoritesPageRoutingModule } from './favorites-page-routing.module';
import { FavoritesPageComponent } from './favorites-page.component';
import { MyBackslashModule } from './my-backslash/my-backslash.module';
import { MyBrandsModule } from './my-brands/my-brands.module';
import { MyDisruptionModule } from './my-disruption/my-disruption.module';
@NgModule({
    imports: [
      ThemeModule,
      AllFavoritesModule,
      FavoritesPageRoutingModule,
      MyBackslashModule,
      MyBrandsModule,
      MyDisruptionModule,
    ],
    declarations: [
      FavoritesPageComponent,
    ],
  })
export class FavoritesPageModule { }

