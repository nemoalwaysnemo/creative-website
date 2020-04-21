import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { GlobalSearchFormModule, GlobalSearchResultModule, PreviewDialogModule } from '../../shared';
import { BizDevThoughtLeadershipComponent } from './biz-dev-thought-leadership.component';

@NgModule({
  imports: [
    ThemeModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
  ],
  declarations: [
    BizDevThoughtLeadershipComponent,
  ],
})
export class BizDevThoughtLeadershipModule { }
