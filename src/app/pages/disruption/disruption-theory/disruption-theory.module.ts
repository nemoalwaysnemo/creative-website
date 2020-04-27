import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { DisruptionTheoryComponent } from './disruption-theory.component';
import { GlobalSearchFormModule, GlobalSearchResultModule } from '../../shared';

@NgModule({
  imports: [
    ThemeModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
  ],
  declarations: [
    DisruptionTheoryComponent,
  ],
})
export class DisruptionTheoryModule { }
