import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { RouterModule } from '@angular/router';
import { HomeSearchFormModule } from '@pages/shared';
import { SharedModule } from '@pages/shared/shared.module';
import { InnovationHomeComponent } from './innovation-home.component';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    HomeSearchFormModule,
  ],
  declarations: [
    InnovationHomeComponent,
  ],
})
export class InnovationHomeModule { }
