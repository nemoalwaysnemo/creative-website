import { NgModule } from '@angular/core';
import { IntelligenceHomeModule } from './intelligence-home/intelligence-home.module';
import { IntelligencePageComponent } from './intelligence-page.component';
import { IntelligencePageRoutingModule } from './intelligence-page-routing.module';
import { IntelligenceFolderModule } from './intelligence-folder/intelligence-folder.module';
import { IntelligenceAssetModule } from './intelligence-asset/intelligence-asset.module';

@NgModule({
  imports: [
    IntelligenceHomeModule,
    IntelligencePageRoutingModule,
    IntelligenceFolderModule,
    IntelligenceAssetModule,
  ],
  declarations: [
    IntelligencePageComponent,
  ],
})
export class IntelligencePageModule {
}
