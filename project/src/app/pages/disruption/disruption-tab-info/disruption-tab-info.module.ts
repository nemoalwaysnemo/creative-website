import { NgModule } from '@angular/core';
import { ACLModule } from '@core/acl';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { DisruptionTabInfoComponent } from './disruption-tab-info.component';

@NgModule({
  imports: [
    ThemeModule,
    ACLModule,
    CommonModule,
  ],
  declarations: [
    DisruptionTabInfoComponent,
  ],
  exports: [
    DisruptionTabInfoComponent,
  ],
})
export class DisruptionTabInfoModule { }
