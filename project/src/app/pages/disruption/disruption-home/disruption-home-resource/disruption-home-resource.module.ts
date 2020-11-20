import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@pages/shared/shared.module';
import { DisruptionHomeResourceComponent } from './disruption-home-resource.component';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
  ],
  declarations: [
    DisruptionHomeResourceComponent,
  ],
  exports: [
    DisruptionHomeResourceComponent,
  ],
})
export class DisruptionHomeResourceModule { }
