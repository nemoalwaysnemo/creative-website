import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { InnovationPageComponent } from './innovation-page.component';
import { InnovationHomeModule } from './innovation-home/innovation-home.module';
import { InnovationPageRoutingModule } from './innovation-page-routing.module';
import { InnovationRemotePageModule } from './innovation-remote-page/innovation-remote-page.module';
import { Innovation10xPageModule } from './innovation-10x-page/innovation-10x-page.module';
import { InnovationFolderModule } from './innovation-folder/innovation-folder.module';
import { InnovationAssetModule } from './innovation-asset/innovation-asset.module';
import { InnovationListModule } from './innovation-list/innovation-list.module';

@NgModule({
  imports: [
    ThemeModule,
    InnovationHomeModule,
    InnovationRemotePageModule,
    InnovationPageRoutingModule,
    Innovation10xPageModule,
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
