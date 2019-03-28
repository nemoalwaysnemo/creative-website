import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@pages/shared/shared.module';
import { MyBrandComponent } from './my-brand.component';
// import { SearchFormComponent } from '@pages/creative/brand/search-form/search-form.component';
import { BrandService } from './brand.service';


@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
  ],
  declarations: [
    MyBrandComponent,
    // SearchFormComponent,
  ],
  providers: [
    SharedModule.forRoot().providers,
    BrandService,
  ],
})
export class MyBrandPageModule { }
