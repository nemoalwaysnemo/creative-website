import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '../../../shared/shared.module';
import { DisruptionRoadmapsComponent } from './disruption-roadmaps.component';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
  ],
  declarations: [
    DisruptionRoadmapsComponent,
  ],
  providers: [
    SharedModule.forRoot().providers,
  ],
})
export class DisruptionRoadmapsModule { }
