import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@pages/shared/shared.module';
import { BrandComponent } from './brand.component';
import { SearchFormComponent } from '@pages/creative/brand/search-form/search-form.component';
import { BrandService } from '@pages/creative/brand/brand.service';


@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
  ],
  declarations: [
    BrandComponent,
    SearchFormComponent,
  ],
  providers: [
    SharedModule.forRoot().providers,
    BrandService,
  ],
})
export class BrandPageModule { }
