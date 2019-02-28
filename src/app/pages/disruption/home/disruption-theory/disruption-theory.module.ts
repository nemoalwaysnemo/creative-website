import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '../../../shared/shared.module';
import { DisruptionTheoryComponent } from './disruption-theory.component';

import { DisruptionRoadsViewModule } from '../../shared/disruption-roads-view/disruption-roads-view.module';
import { DisruptionSearchFormModule } from '../../shared/disruption-search-form/disruption-search-form.module';
@NgModule({
  imports: [
    ThemeModule,
    SharedModule,

    DisruptionRoadsViewModule,
    DisruptionSearchFormModule,
  ],
  declarations: [
    DisruptionTheoryComponent,
  ],
  providers: [
    SharedModule.forRoot().providers,
  ],
})
export class DisruptionTheoryModule { }
