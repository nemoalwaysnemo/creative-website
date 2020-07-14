import { NgModule } from '@angular/core';
import { BackslashHomeModule } from './backslash-home/backslash-home.module';
import { BackslashPageComponent } from './backslash-page.component';
import { BackslashPageRoutingModule } from './backslash-page-routing.module';
import { BackslashAssetModule } from './backslash-asset/backslash-asset.module';
import { BackslashRemotePageComponent } from './backslash-remote-page.component';
import { ACLModule } from '@core/acl';

@NgModule({
  imports: [
    ACLModule,
    BackslashHomeModule,
    BackslashAssetModule,
    BackslashPageRoutingModule,
  ],
  declarations: [
    BackslashPageComponent,
    BackslashRemotePageComponent,
  ],
})
export class BackslashPageModule {
}
