import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { IntelligenceFormButtonComponent } from './intelligence-form-button.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
  ],
  declarations: [
    IntelligenceFormButtonComponent,
  ],
  exports: [
    IntelligenceFormButtonComponent,
  ],
})

export class DisruptionFormButtonModule { }
