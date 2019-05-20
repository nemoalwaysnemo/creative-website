import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { MyBrandsComponent } from './my-brands.component';
import { GlobalSearchFormModule, GlobalSearchResultModule, PreviewDialogModule  } from '@pages/shared';
@NgModule({
  imports: [
    ThemeModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    PreviewDialogModule,
  ],
  declarations: [
    MyBrandsComponent,
  ],
  providers: [
  ],
})
export class MyBrandsModule { }
