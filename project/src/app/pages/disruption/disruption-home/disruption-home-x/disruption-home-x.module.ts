import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@pages/shared/shared.module';
import { GlobalDocumentDialogModule } from '@pages/shared';
import { DisruptionHomeXComponent } from './disruption-home-x.component';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    GlobalDocumentDialogModule,
  ],
  declarations: [
    DisruptionHomeXComponent,
  ],
  exports: [
    DisruptionHomeXComponent,
  ],
})
export class DisruptionHomeXModule { }
