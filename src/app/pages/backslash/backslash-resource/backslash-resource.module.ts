import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { BackslashResourceComponent } from './backslash-resource.component';
import { SharedModule } from '@pages/shared/shared.module';
import { GlobalSearchFormModule, GlobalSearchResultModule } from '../../shared';


@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
  ],
  declarations: [
    BackslashResourceComponent,
  ],
})
export class BackslashResourceModule { }
