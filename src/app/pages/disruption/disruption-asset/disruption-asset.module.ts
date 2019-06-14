import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { RouterModule } from '@angular/router';
import { SharedServiceModule } from '@pages/shared';
import { SharedModule } from '@pages/shared/shared.module';
import { DisruptionAssetComponent } from './disruption-asset.component';
import { DisruptionFolderViewModule } from '../disruption-folder-view/disruption-folder-view.module';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    RouterModule,
    DisruptionFolderViewModule,
  ],
  declarations: [
    DisruptionAssetComponent,
  ],
  providers: [
    ...SharedServiceModule.forRoot().providers,
  ],
})
export class DisruptionAssetModule { }
