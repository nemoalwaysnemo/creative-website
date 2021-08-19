import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@pages/shared/shared.module';
import { CreativeMyAgencyComponent } from './creative-my-agency.component';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
  ],
  declarations: [
    CreativeMyAgencyComponent,
  ],
})
export class CreativeMyAgencyModule { }
