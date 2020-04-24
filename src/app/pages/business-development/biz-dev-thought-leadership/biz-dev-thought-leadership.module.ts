import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { GlobalSearchFormModule, GlobalSearchResultModule, PreviewDialogModule } from '../../shared';
import { BizDevThoughtLeadershipComponent } from './biz-dev-thought-leadership.component';
import { BizDevFormButtonModule } from '../biz-dev-form-button/biz-dev-form-button.module';

@NgModule({
  imports: [
    ThemeModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    BizDevFormButtonModule,
  ],
  declarations: [
    BizDevThoughtLeadershipComponent,
  ],
})
export class BizDevThoughtLeadershipModule { }
