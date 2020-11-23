import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '../../shared/shared.module';
import { DisruptionTheoryAssetComponent } from './disruption-theory-asset.component';
import { DisruptionTabInfoModule } from '../disruption-tab-info/disruption-tab-info.module';
import { DisruptionFolderViewModule } from '../disruption-folder-view/disruption-folder-view.module';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    DisruptionTabInfoModule,
    DisruptionFolderViewModule,
  ],
  declarations: [
    DisruptionTheoryAssetComponent,
  ],
})
export class DisruptionTheoryAssetModule { }
