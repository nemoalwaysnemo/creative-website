import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { DisruptionDaysFolderComponent } from './disruption-days-folder.component';
import { GlobalSearchFormModule, GlobalSearchResultModule, SharedServiceModule, PreviewDialogModule } from '@pages/shared';
import { DisruptionFolderViewModule } from '../disruption-folder-view/disruption-folder-view.module';
import { DisruptionFormDaysFolderDialogComponent } from './disruption-form-days-folder-body/disruption-form-days-folder-dialog.component';
import { DisruptionFormFolderModule } from '../../shared/disruption-form-folder/disruption-form-folder.module';

@NgModule({
  imports: [
    ThemeModule,
    PreviewDialogModule,
    CommonModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    DisruptionFolderViewModule,
    DisruptionFormFolderModule,
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
