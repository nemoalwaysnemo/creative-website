import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '../shared/shared.module';
import { BrandComponent } from './brand.component';


@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
  ],
  declarations: [
    BrandComponent,
  ],
  providers: [
    SharedModule.forRoot().providers,
  ],
})
export class BrandPageModule { }
