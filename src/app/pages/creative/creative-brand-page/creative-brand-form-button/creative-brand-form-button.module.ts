import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { CreativeBrandFormButtonComponent } from './creative-brand-form-button.component';
import { SharedModule } from '../../../shared/shared.module';
import { ACLModule } from '@core/acl';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    ACLModule,
  ],
  declarations: [
    CreativeBrandFormButtonComponent,
  ],
  exports: [
    CreativeBrandFormButtonComponent,
  ],
})

export class CreativeBrandFormButtonModule { }
