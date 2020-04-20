import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { DisruptionFormButtonComponent } from './disruption-form-button.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
  ],
  declarations: [
    DisruptionFormButtonComponent,
  ],
  exports: [
    DisruptionFormButtonComponent,
  ],
})

export class DisruptionFormButtonModule { }
