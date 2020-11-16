import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { UsageRightWidgetComponent } from './usage-right-widget.component';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
  ],
  exports: [
    UsageRightWidgetComponent,
  ],
  declarations: [
    UsageRightWidgetComponent,
  ],
})
export class UsageRightWidgetModule { }
