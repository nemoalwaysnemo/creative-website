import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { GlobalSearchFormModule, GlobalSearchResultModule } from '@pages/shared';
import { FavoriteDisruptionComponent } from './favorite-disruption.component';

@NgModule({
  imports: [
    ThemeModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
  ],
  declarations: [
    FavoriteDisruptionComponent,
  ],
})
export class FavoriteDisruptionModule { }
