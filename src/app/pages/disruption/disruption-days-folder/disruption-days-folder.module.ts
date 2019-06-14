import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { DisruptionDaysFolderComponent } from './disruption-days-folder.component';
import { GlobalSearchFormModule, GlobalSearchResultModule, SharedServiceModule, PreviewDialogModule } from '@pages/shared';
import { DisruptionFoldersViewModule } from '../disruption-folders-view/disruption-folders-view.module';
import { DisruptionFormDaysFolderDialogComponent } from './disruption-form-days-folder-body/disruption-form-days-folder-dialog.component';
import { DisruptionFormFoldersModule } from '../../shared/disruption-form-folders/disruption-form-folders.module';

@NgModule({
  imports: [
    ThemeModule,
    PreviewDialogModule,
    CommonModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    DisruptionFoldersViewModule,
    DisruptionFormFoldersModule,
  ],
  declarations: [
    DisruptionDaysFolderComponent,
    DisruptionFormDaysFolderDialogComponent,
  ],
  providers: [
    ...SharedServiceModule.forRoot().providers,
  ],
})
export class DisruptionDaysFolderModule { }
