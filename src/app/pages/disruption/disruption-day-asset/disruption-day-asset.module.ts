import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@pages/shared/shared.module';
import { DisruptionDayAssetComponent } from './disruption-day-asset.component';
import { DisruptionFolderViewModule } from '../disruption-folder-view/disruption-folder-view.module';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    DisruptionFolderViewModule,
  ],
  declarations: [
    DisruptionDayAssetComponent,
  ],
  providers: [
    SharedModule.forRoot().providers,
  ],
})
export class DisruptionDayAssetModule { }
