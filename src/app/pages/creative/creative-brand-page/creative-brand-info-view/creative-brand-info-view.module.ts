import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { CreativeBrandInfoViewComponent } from './creative-brand-info-view.component';
import { ACLModule } from '@core/acl';

@NgModule({
  imports: [
    ThemeModule,
    ACLModule,
    CommonModule,
  ],
  declarations: [
    CreativeBrandInfoViewComponent,
  ],
  exports: [
    CreativeBrandInfoViewComponent,
  ],
})
export class CreativeBrandInfoViewModule { }
