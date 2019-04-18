import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@pages/shared/shared.module';
import { DisruptionTheoryComponent } from './disruption-theory.component';
import { GlobalSearchFormModule, GlobalSearchResultModule, PreviewDialogModule } from '@pages/shared';
import { DisruptionFormTheoryModule } from '@pages/shared/disruption-form-theory/disruption-form-theory.module';
import { DisruptionFormTheoryDialogComponent } from './disruption-form-theory-body/disruption-form-theory-dialog.component';

@NgModule({
  imports: [
    ThemeModule,
    PreviewDialogModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    DisruptionFormTheoryModule,
  ],
  declarations: [
    DisruptionTheoryComponent,
    DisruptionFormTheoryDialogComponent,
  ],
  providers: [
    SharedModule.forRoot().providers,
  ],
})
export class DisruptionTheoryModule { }
