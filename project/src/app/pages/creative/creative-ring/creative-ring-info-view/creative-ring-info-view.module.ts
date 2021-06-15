import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { CreativeRingInfoViewComponent } from './creative-ring-info-view.component';
import { ACLModule } from '@core/acl';

@NgModule({
  imports: [
    ThemeModule,
    ACLModule,
    CommonModule,
  ],
  declarations: [
    CreativeRingInfoViewComponent,
  ],
  exports: [
    CreativeRingInfoViewComponent,
  ],
})
export class CreativeRingInfoViewModule { }
