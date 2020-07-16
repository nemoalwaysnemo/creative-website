import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { ACLModule } from '@core/acl';
import { GlobalDocumentDialogModule } from '@pages/shared';
import { CreativeAgencyFormButtonComponent } from './creative-agency-form-button.component';

@NgModule({
  imports: [
    ThemeModule,
    ACLModule,
    GlobalDocumentDialogModule,
  ],
  declarations: [
    CreativeAgencyFormButtonComponent,
  ],
  exports: [
    CreativeAgencyFormButtonComponent,
  ],
})

export class CreativeAgencyFormButtonModule { }
