import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@pages/shared/shared.module';
import { DisruptionTheoryComponent } from './disruption-theory.component';
import { GlobalSearchFormModule, GlobalSearchResultModule, PreviewDialogModule } from '@pages/shared';

@NgModule({
  imports: [
    ThemeModule,
    PreviewDialogModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
  ],
  declarations: [
    DisruptionTheoryComponent,
  ],
  providers: [
    SharedModule.forRoot().providers,
  ],
})
export class DisruptionTheoryModule { }
