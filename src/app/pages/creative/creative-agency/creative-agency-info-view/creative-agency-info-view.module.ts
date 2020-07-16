import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { CreativeAgencyInfoViewComponent } from './creative-agency-info-view.component';
import { ACLModule } from '@core/acl';

@NgModule({
  imports: [
    ThemeModule,
    ACLModule,
    CommonModule,
  ],
  declarations: [
    CreativeAgencyInfoViewComponent,
  ],
  exports: [
    CreativeAgencyInfoViewComponent,
  ],
})
export class CreativeAgencyInfoViewModule { }
