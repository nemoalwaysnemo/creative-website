import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@pages/shared/shared.module';
import { GlobalDocumentDialogModule } from '@pages/shared';
import { DisruptionHomeXComponent } from './disruption-home-x.component';
import { DisruptionFormButtonModule } from '../../../disruption/disruption-form-button/disruption-form-button.module';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    GlobalDocumentDialogModule,
    DisruptionFormButtonModule,
  ],
  declarations: [
    DisruptionHomeXComponent,
  ],
  exports: [
    DisruptionHomeXComponent,
  ],
})
export class DisruptionHomeXModule { }
