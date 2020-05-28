import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { InnovationPageComponent } from './innovation-page.component';
import { InnovationHomeModule } from './innovation-home/innovation-home.module';
import { InnovationPageRoutingModule } from './innovation-page-routing.module';
import { InnovationRemotePageModule } from './innovation-remote-page/innovation-remote-page.module';

@NgModule({
  imports: [
    ThemeModule,
    InnovationHomeModule,
    InnovationRemotePageModule,
    InnovationPageRoutingModule,
  ],
  declarations: [
    InnovationPageComponent,
  ],
})
export class InnovationPageModule {
}
