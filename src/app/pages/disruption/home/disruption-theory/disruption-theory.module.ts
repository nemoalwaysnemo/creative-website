import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@pages/shared/shared.module';
import { DisruptionTheoryComponent } from './disruption-theory.component';
import { DisruptionListViewModule } from '../../disruption-shared/disruption-list-view/disruption-list-view.module';
import { DisruptionSearchFormModule } from '../../disruption-shared/disruption-search-form/disruption-search-form.module';
@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    DisruptionListViewModule,
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
