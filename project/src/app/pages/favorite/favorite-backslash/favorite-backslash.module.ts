import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { GlobalSearchFormModule, GlobalSearchResultModule } from '@pages/shared';
import { FavoriteBackslashComponent } from './favorite-backslash.component';
@NgModule({
  imports: [
    ThemeModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
  ],
  declarations: [
    FavoriteBackslashComponent,
  ],
})
export class FavoriteBackslashModule { }
