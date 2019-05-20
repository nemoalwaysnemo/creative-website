import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@pages/shared/shared.module';
import { AllFavoritesComponent } from './all-favorites.component';
import { FavoritesThumbnailViewModule } from '../../favorites-shared/favorites-thumbnail-view/favorites-thumbnail-view.module';
@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    FavoritesThumbnailViewModule,
  ],
  declarations: [
    AllFavoritesComponent,
  ],
  providers: [
    SharedModule.forRoot().providers,
  ],
})
export class AllFavoritesModule { }
