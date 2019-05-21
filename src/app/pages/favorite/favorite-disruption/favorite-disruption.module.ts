import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { GlobalSearchFormModule, GlobalSearchResultModule, PreviewDialogModule } from '@pages/shared';
import { FavoriteDisruptionComponent } from './favorite-disruption.component';

@NgModule({
  imports: [
    ThemeModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    PreviewDialogModule,
  ],
  declarations: [
    FavoriteDisruptionComponent,
  ],
})
export class FavoriteDisruptionModule { }
