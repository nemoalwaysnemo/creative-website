import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@pages/shared/shared.module';
import { CreativeMyAgencyPageComponent } from './creative-my-agency-page.component';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    RouterModule,
  ],
  declarations: [
    CreativeMyAgencyPageComponent,
  ],
})
export class CreativeMyAgencyPageModule { }
