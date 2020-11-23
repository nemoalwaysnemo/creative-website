import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { DisruptionTheoryComponent } from './disruption-theory.component';
import { GlobalSearchFormModule, GlobalSearchResultModule } from '../../shared';
import { DisruptionTabInfoModule } from '../disruption-tab-info/disruption-tab-info.module';

@NgModule({
  imports: [
    ThemeModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    DisruptionTabInfoModule,
  ],
  declarations: [
    DisruptionTheoryComponent,
  ],
})
export class DisruptionTheoryModule { }
