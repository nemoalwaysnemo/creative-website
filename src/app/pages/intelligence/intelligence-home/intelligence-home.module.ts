import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { IntelligenceHomeComponent } from './intelligence-home.component';
import { RouterModule } from '@angular/router';
import { HomeSearchFormModule } from '@pages/shared';

@NgModule({
  imports: [
    ThemeModule,
    RouterModule,
    HomeSearchFormModule,
  ],
  declarations: [
    IntelligenceHomeComponent,
  ],
})
export class IntelligenceHomeModule { }
