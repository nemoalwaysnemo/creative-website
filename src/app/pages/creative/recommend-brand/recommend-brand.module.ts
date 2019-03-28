import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@pages/shared/shared.module';
import { RecommendBrandComponent } from './recommend-brand.component';
// import { SearchFormComponent } from '@pages/creative/recommend-brand/search-form/search-form.component';
import { RecommendBrandService } from './recommend-brand.service';


@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
  ],
  declarations: [
    RecommendBrandComponent,
  ],
  providers: [
    SharedModule.forRoot().providers,
    RecommendBrandService,
  ],
})
export class RecommendBrandPageModule { }
