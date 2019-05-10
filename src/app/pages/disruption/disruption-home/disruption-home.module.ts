import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { DisruptionHomeComponent } from './disruption-home.component';
import { RouterModule } from '@angular/router';
import { HomeSearchFormModule } from '@pages/shared';

@NgModule({
  imports: [
    ThemeModule,
    RouterModule,
    HomeSearchFormModule,
  ],
  declarations: [
    DisruptionHomeComponent,
  ],
})
export class DisruptionHomeModule { }
