import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { InnovationPageComponent } from './innovation-page.component';
import { InnovationHomeModule } from './innovation-home/innovation-home.module';
import { InnovationPageRoutingModule } from './innovation-page-routing.module';
import { InnovationRemotePageModule } from './innovation-remote-page/innovation-remote-page.module';
import { InnovationListModule } from './innovation-list/innovation-list.module';
import { InnovationFolderModule } from './innovation-folder/innovation-folder.module';
import { InnovationAssetModule } from './innovation-asset/innovation-asset.module';

@NgModule({
  imports: [
    ThemeModule,
    InnovationHomeModule,
    InnovationRemotePageModule,
    InnovationPageRoutingModule,
    InnovationListModule,
    InnovationFolderModule,
    InnovationAssetModule,
  ],
  declarations: [
    InnovationPageComponent,
  ],
})
export class InnovationPageModule {
}
