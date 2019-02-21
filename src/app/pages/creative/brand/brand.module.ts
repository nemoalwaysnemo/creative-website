import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '../../shared/shared.module';
import { BrandComponent } from './brand.component';
import { SearchFormComponent } from '@pages/creative/brand/search-form/search-form.component';
import { BrandService } from '@pages/creative/brand/brand.service';
import { SearchResultComponent } from '@pages/creative/brand/search-result/search-result.component';


@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
  ],
  declarations: [
    BrandComponent,
    SearchFormComponent,
    SearchResultComponent,
  ],
  providers: [
    SharedModule.forRoot().providers,
    BrandService,
  ],
})
export class BrandPageModule { }
