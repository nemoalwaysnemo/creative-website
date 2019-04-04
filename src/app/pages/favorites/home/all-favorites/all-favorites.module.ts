import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@pages/shared/shared.module';
import { AllFavoritesComponent } from './all-favorites.component';
@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
  ],
  declarations: [
    AllFavoritesComponent,
  ],
  providers: [
    SharedModule.forRoot().providers,
  ],
})
export class AllFavoritesModule { }
