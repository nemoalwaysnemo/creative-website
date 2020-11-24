import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { DisruptionDaysComponent } from './disruption-days.component';
import { DocumentRouteTabsetModule, GlobalSearchFormModule, GlobalSearchResultModule } from '../../shared';
import { DisruptionFormButtonModule } from '../disruption-form-button/disruption-form-button.module';

@NgModule({
  imports: [
    ThemeModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    DisruptionFormButtonModule,
    DocumentRouteTabsetModule,
  ],
  declarations: [
    DisruptionDaysComponent,
  ],
})
export class DisruptionDaysModule { }
