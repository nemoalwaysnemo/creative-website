import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { GlobalSearchFormModule, GlobalSearchResultModule } from '@pages/shared';
import { FavoriteEdgeComponent } from './favorite-edge.component';
@NgModule({
  imports: [
    ThemeModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
  ],
  declarations: [
    FavoriteEdgeComponent,
  ],
})
export class FavoriteEdgeModule { }
