import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { DisruptionTheoryComponent } from './disruption-theory.component';
import { GlobalSearchFormModule, GlobalSearchResultModule, PreviewDialogModule } from '../../shared';

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
})
export class DisruptionTheoryModule { }
