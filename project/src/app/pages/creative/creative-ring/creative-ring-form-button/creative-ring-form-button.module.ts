import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { ACLModule } from '@core/acl';
import { GlobalDocumentDialogModule } from '@pages/shared';
import { CreativeRingFormButtonComponent } from './creative-ring-form-button.component';

@NgModule({
  imports: [
    ThemeModule,
    ACLModule,
    GlobalDocumentDialogModule,
  ],
  declarations: [
    CreativeRingFormButtonComponent,
  ],
  exports: [
    CreativeRingFormButtonComponent,
  ],
})

export class CreativeRingFormButtonModule { }
