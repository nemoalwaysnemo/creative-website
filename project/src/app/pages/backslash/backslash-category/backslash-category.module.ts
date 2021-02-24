import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { BackslashCategoryComponent } from './backslash-category.component';
import { SharedModule } from '@pages/shared/shared.module';
import { GlobalSearchFormModule, GlobalSearchResultModule } from '../../shared';
import { BackslashFormButtonModule } from '../backslash-form-button/backslash-form-button.module';
@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    BackslashFormButtonModule,
  ],
  declarations: [
    BackslashCategoryComponent,
  ],
})
export class BackslashCategoryModule { }
