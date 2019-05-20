import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { GlobalSearchFormModule, GlobalSearchResultModule, PreviewDialogModule  } from '@pages/shared';
import { AllFavoritesComponent } from './all-favorites.component';
@NgModule({
  imports: [
    ThemeModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    PreviewDialogModule,
  ],
  declarations: [
    AllFavoritesComponent,
  ],
  providers: [
  ],
})
export class AllFavoritesModule { }
