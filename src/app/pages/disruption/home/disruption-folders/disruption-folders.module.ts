import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@pages/shared/shared.module';
import { DisruptionFoldersComponent } from './disruption-folders.component';
import { DisruptionThumbnailViewModule } from '../../shared/disruption-thumbnail-view/disruption-thumbnail-view.module';
import { DisruptionFoldersViewModule } from '../../shared/disruption-folders-view/disruption-folders-view.module';
@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    RouterModule,
    DisruptionFoldersViewModule,
    DisruptionThumbnailViewModule,
  ],
  declarations: [
    DisruptionFoldersComponent,
  ],
  providers: [
    SharedModule.forRoot().providers,
  ],
})
export class DisruptionFoldersModule { }
