import { NgModule } from '@angular/core';
import { ACLModule } from '@core/acl';
import { BackslashPageComponent } from './backslash-page.component';
import { BackslashEdgeModule } from './backslash-edge/backslash-edge.module';
import { BackslashAssetViewModule } from './backslash-asset-view/backslash-asset-view.module';
import { BackslashEdgeFolderModule } from './backslash-edge-folder/backslash-edge-folder.module';
import { BackslashHomeModule } from './backslash-home/backslash-home.module';
import { BackslashPageRoutingModule } from './backslash-page-routing.module';
import { BackslashAssetModule } from './backslash-asset/backslash-asset.module';
import { BackslashResourceModule } from './backslash-resource/backslash-resource.module';
import { BackslashCaseStudyModule } from './backslash-case-study/backslash-case-study.module';
import { BackslashTriggerPoolModule } from './backslash-trigger-pool/backslash-trigger-pool.module';
import { BackslashResourceFolderModule } from './backslash-resource-folder/backslash-resource-folder.module';
import { BackslashCaseStudyFolderModule } from './backslash-case-study-folder/backslash-case-study-folder.module';
import { BackslashTriggerPoolViewModule } from './backslash-trigger-pool-view/backslash-trigger-pool-view.module';
import { BackslashRemotePageModule } from './backslash-remote-page/backslash-remote-page.module';
import { BackslashCategoryModule } from './backslash-category/backslash-category.module';
import { BackslashRegionModule } from './backslash-region/backslash-region.module';
import { BackslashTriggerModule } from './backslash-trigger/backslash-trigger.module';
import { BackslashTriggerPreferenceModule } from './backslash-trigger-preference/backslash-trigger-preference.module';
import { BackslashTriggerHeaderModule } from './backslash-trigger-header/backslash-trigger-header.module';

@NgModule({
  imports: [
    ACLModule,
    BackslashHomeModule,
    BackslashEdgeModule,
    BackslashAssetViewModule,
    BackslashEdgeFolderModule,
    BackslashAssetModule,
    BackslashResourceModule,
    BackslashCaseStudyModule,
    BackslashTriggerPoolModule,
    BackslashPageRoutingModule,
    BackslashResourceFolderModule,
    BackslashCaseStudyFolderModule,
    BackslashTriggerPoolViewModule,
    BackslashRemotePageModule,
    BackslashCategoryModule,
    BackslashRegionModule,
    BackslashTriggerModule,
    BackslashTriggerPreferenceModule,
    BackslashTriggerHeaderModule,
  ],
  declarations: [
    BackslashPageComponent,
  ],
})
export class BackslashPageModule {
}
