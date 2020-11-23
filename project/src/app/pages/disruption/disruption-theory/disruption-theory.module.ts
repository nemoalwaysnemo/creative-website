import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { DisruptionTheoryComponent } from './disruption-theory.component';
import { DocumentRouteTabsetModule, GlobalSearchFormModule, GlobalSearchResultModule } from '../../shared';

@NgModule({
  imports: [
    ThemeModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    DocumentRouteTabsetModule,
  ],
  declarations: [
    DisruptionTheoryComponent,
  ],
})
export class DisruptionTheoryModule { }
