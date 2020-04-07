import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { CreativeBrandFormButtonComponent } from './creative-brand-form-button.component';
import { SharedModule } from '@pages/shared/shared.module';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
  ],
  declarations: [
    CreativeBrandFormButtonComponent,
  ],
  exports: [
    CreativeBrandFormButtonComponent,
  ],
  providers: [
    SharedModule.forRoot().providers,
  ],
})

export class CreativeBrandFormButtonModule { }
