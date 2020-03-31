import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { IntelligenceFormButtonComponent } from './intelligence-form-button.component';
import { SharedModule } from '@pages/shared/shared.module';

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
  providers: [
    SharedModule.forRoot().providers,
  ],
})

export class DisruptionFormButtonModule { }
