import { NgModule } from '@angular/core';
import { CreativeHomePageModule } from './creative-home-page/creative-home-page.module';
import { CreativePageComponent } from './creative-page.component';
import { CreativePageRoutingModule } from './creative-page-routing.module';
import { CreativeAssetPageModule } from './creative-asset-page/creative-asset-page.module';
import { CreativeBrandPageModule } from './creative-brand-page/creative-brand-page.module';

@NgModule({
  imports: [
    CreativeHomePageModule,
    CreativeAssetPageModule,
    CreativeBrandPageModule,
    CreativePageRoutingModule,
  ],
  declarations: [
    CreativePageComponent,
  ],
})
export class CreativePageModule {
}
