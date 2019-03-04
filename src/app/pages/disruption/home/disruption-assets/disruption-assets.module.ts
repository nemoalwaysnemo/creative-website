import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { SharedModule } from '@pages/shared/shared.module';
import { DisruptionAssetsComponent } from './disruption-assets.component';
import { DisruptionThumbnailViewModule } from '../../shared/disruption-thumbnail-view/disruption-thumbnail-view.module';
import { DisruptionSearchFormModule } from '../../shared/disruption-search-form/disruption-search-form.module';
import { DisruptionFoldersViewModule } from '../../shared/disruption-folders-view/disruption-folders-view.module';
@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    DisruptionThumbnailViewModule,
    DisruptionSearchFormModule,
    DisruptionFoldersViewModule,
  ],
  declarations: [
    DisruptionAssetsComponent,
  ],
  providers: [
    SharedModule.forRoot().providers,
  ],
})
export class DisruptionAssetsModule { }
