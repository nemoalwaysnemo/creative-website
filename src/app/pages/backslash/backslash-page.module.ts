import { NgModule } from '@angular/core';
import { ACLModule } from '@core/acl';
import { BackslashPageComponent } from './backslash-page.component';
import { BackslashEdgeModule } from './backslash-edge/backslash-edge.module';
import { BackslashHomeModule } from './backslash-home/backslash-home.module';
import { BackslashPageRoutingModule } from './backslash-page-routing.module';
import { BackslashAssetModule } from './backslash-asset/backslash-asset.module';
import { BackslashRemotePageComponent } from './backslash-remote-page.component';
import { BackslashResourceModule } from './backslash-resource/backslash-resource.module';
import { BackslashCaseStudyModule } from './backslash-case-study/backslash-case-study.module';
import { BackslashTriggerPoolModule } from './backslash-trigger-pool/backslash-trigger-pool.module';
import { BackslashResourceFolderModule } from './backslash-resource-folder/backslash-resource-folder.module';

@NgModule({
  imports: [
    ACLModule,
    BackslashHomeModule,
    BackslashEdgeModule,
    BackslashAssetModule,
    BackslashResourceModule,
    BackslashCaseStudyModule,
    BackslashTriggerPoolModule,
    BackslashPageRoutingModule,
    BackslashResourceFolderModule,
  ],
  declarations: [
    BackslashPageComponent,
    BackslashRemotePageComponent,
  ],
})
export class BackslashPageModule {
}
