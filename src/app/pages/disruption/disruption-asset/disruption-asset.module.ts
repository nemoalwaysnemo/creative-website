import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@pages/shared/shared.module';
import { DisruptionAssetComponent } from './disruption-asset.component';
import { DisruptionFoldersViewModule } from '../disruption-folders-view/disruption-folders-view.module';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    DisruptionFoldersViewModule,
  ],
  declarations: [
    DisruptionAssetComponent,
  ],
  providers: [
    SharedModule.forRoot().providers,
  ],
})
export class DisruptionAssetModule { }
