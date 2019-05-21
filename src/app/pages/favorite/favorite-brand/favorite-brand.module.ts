import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { FavoriteBrandComponent } from './favorite-brand.component';
import { GlobalSearchFormModule, GlobalSearchResultModule, PreviewDialogModule } from '@pages/shared';
@NgModule({
  imports: [
    ThemeModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    PreviewDialogModule,
  ],
  declarations: [
    FavoriteBrandComponent,
  ],
})
export class FavoriteBrandModule { }
