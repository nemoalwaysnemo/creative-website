import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { DisruptionXComponent } from './disruption-x.component';
import { SharedModule } from '@pages/shared/shared.module';
import { GlobalSearchFormModule, GlobalSearchResultModule, GlobalDocumentDialogModule } from '@pages/shared';
import { DisruptionFormButtonModule } from '../disruption-form-button/disruption-form-button.module';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    GlobalDocumentDialogModule,
    DisruptionFormButtonModule,
  ],
  declarations: [
    DisruptionXComponent,
  ],
})
export class DisruptionXModule { }
