import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '../../shared/shared.module';
import { DisruptionTheoryAssetComponent } from './disruption-theory-asset.component';
import { DisruptionFolderViewModule } from '../disruption-folder-view/disruption-folder-view.module';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    DisruptionFolderViewModule,
  ],
  declarations: [
    DisruptionTheoryAssetComponent,
  ],
})
export class DisruptionTheoryAssetModule { }
