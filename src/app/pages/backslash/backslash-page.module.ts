import { NgModule } from '@angular/core';
import { BackslashHomePageModule } from './backslash-home-page/backslash-home-page.module';
import { BackslashPageComponent } from './backslash-page.component';
import { BackslashPageRoutingModule } from './backslash-page-routing.module';
import { BackslashAssetPageModule } from './backslash-asset-page/backslash-asset-page.module';
import { BackslashRemotePageComponent } from './backslash-remote-page.component';
import { ACLModule } from '@core/acl';

@NgModule({
  imports: [
    ACLModule,
    BackslashHomePageModule,
    BackslashAssetPageModule,
    BackslashPageRoutingModule,
  ],
  declarations: [
    BackslashPageComponent,
    BackslashRemotePageComponent,
  ],
})
export class BackslashPageModule {
}
