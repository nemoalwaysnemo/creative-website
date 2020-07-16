import { NgModule } from '@angular/core';
import { CreativeHomeModule } from './creative-home/creative-home.module';
import { CreativePageComponent } from './creative-page.component';
import { CreativePageRoutingModule } from './creative-page-routing.module';
import { CreativeAssetModule } from './creative-asset/creative-asset.module';
import { CreativeBrandModule } from './creative-brand/creative-brand.module';
import { CreativeAgencyModule } from './creative-agency/creative-agency.module';
import { CreativeMyAgencyModule } from './creative-my-agency/creative-my-agency.module';

@NgModule({
  imports: [
    CreativeHomeModule,
    CreativeAssetModule,
    CreativeBrandModule,
    CreativeAgencyModule,
    CreativeMyAgencyModule,
    CreativePageRoutingModule,
  ],
  declarations: [
    CreativePageComponent,
  ],
})
export class CreativePageModule {
}
