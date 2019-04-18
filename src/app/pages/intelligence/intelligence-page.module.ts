import { NgModule } from '@angular/core';
import { HomePageModule } from './home/home.module';
import { IntelligencePageComponent } from './intelligence-page.component';
import { IntelligencePageRoutingModule } from './intelligence-page-routing.module';
import { IntelligenceFoldersModule } from './intelligence-folders/intelligence-folders.module';
import { IntelligenceAssetModule } from './intelligence-asset/intelligence-asset.module';

@NgModule({
  imports: [
    HomePageModule,
    IntelligencePageRoutingModule,
    IntelligenceFoldersModule,
    IntelligenceAssetModule,
  ],
  declarations: [
    IntelligencePageComponent,
  ],
})
export class IntelligencePageModule {
}
