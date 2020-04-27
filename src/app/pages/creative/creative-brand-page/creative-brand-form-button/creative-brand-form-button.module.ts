import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { ACLModule } from '@core/acl';
import { GlobalDocumentDialogModule } from '@pages/shared';
import { CreativeBrandFormButtonComponent } from './creative-brand-form-button.component';

@NgModule({
  imports: [
    ThemeModule,
    ACLModule,
    GlobalDocumentDialogModule,
  ],
  declarations: [
    CreativeBrandFormButtonComponent,
  ],
  exports: [
    CreativeBrandFormButtonComponent,
  ],
})

export class CreativeBrandFormButtonModule { }
