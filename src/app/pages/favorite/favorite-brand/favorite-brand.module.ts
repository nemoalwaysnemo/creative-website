import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { FavoriteBrandComponent } from './favorite-brand.component';
import { GlobalSearchFormModule, GlobalSearchResultModule } from '@pages/shared';
@NgModule({
  imports: [
    ThemeModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
  ],
  declarations: [
    FavoriteBrandComponent,
  ],
})
export class FavoriteBrandModule { }
