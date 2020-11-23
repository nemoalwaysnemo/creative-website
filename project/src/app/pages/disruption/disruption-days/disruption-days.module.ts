import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { DisruptionDaysComponent } from './disruption-days.component';
import { GlobalSearchFormModule, GlobalSearchResultModule } from '../../shared';
import { DisruptionTabInfoModule } from '../disruption-tab-info/disruption-tab-info.module';
import { DisruptionFormButtonModule } from '../disruption-form-button/disruption-form-button.module';

@NgModule({
  imports: [
    ThemeModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    DisruptionTabInfoModule,
    DisruptionFormButtonModule,
  ],
  declarations: [
    DisruptionDaysComponent,
  ],
})
export class DisruptionDaysModule { }
