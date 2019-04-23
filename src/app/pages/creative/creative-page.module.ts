import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { CreativeHomePageModule } from './creative-home/creative-home.module';
import { CreativePageComponent } from './creative-page.component';
import { CreativePageRoutingModule } from './creative-page-routing.module';
import { CreativeAssetPageModule } from './creative-asset/creative-asset.module';

@NgModule({
  imports: [
    ThemeModule,
    CreativeHomePageModule,
    CreativeAssetPageModule,
    CreativePageRoutingModule,
  ],
  declarations: [
    CreativePageComponent,
  ],
})
export class CreativePageModule {
}
