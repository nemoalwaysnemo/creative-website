import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@pages/shared/shared.module';
import { DisruptionDayAssetComponent } from './disruption-day-asset.component';
import { DisruptionFoldersViewModule } from '../disruption-folders-view/disruption-folders-view.module';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    DisruptionFoldersViewModule,
  ],
  declarations: [
    DisruptionDayAssetComponent,
  ],
  providers: [
    SharedModule.forRoot().providers,
  ],
})
export class DisruptionDayAssetModule { }
