import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { BizDevFormButtonComponent } from './biz-dev-form-button.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
  ],
  declarations: [
    BizDevFormButtonComponent,
  ],
  exports: [
    BizDevFormButtonComponent,
  ],
})

export class DisruptionFormButtonModule { }
