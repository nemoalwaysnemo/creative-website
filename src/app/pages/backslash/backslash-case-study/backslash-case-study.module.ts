import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { BackslashCaseStudyComponent } from './backslash-case-study.component';
import { SharedModule } from '@pages/shared/shared.module';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
  ],
  declarations: [
    BackslashCaseStudyComponent,
  ],
})
export class BackslashCaseStudyModule { }
