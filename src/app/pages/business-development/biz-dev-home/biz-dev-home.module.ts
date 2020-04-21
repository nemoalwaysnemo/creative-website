import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { RouterModule } from '@angular/router';
import { HomeSearchFormModule } from '@pages/shared';
import { SharedModule } from '@pages/shared/shared.module';
import { BizDevHomeComponent } from './biz-dev-home.component';

@NgModule({
  imports: [
    ThemeModule,
    RouterModule,
    SharedModule,
    HomeSearchFormModule,
  ],
  declarations: [
    BizDevHomeComponent,
  ],
})
export class BizDevHomeModule { }
