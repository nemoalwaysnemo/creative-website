import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { DisruptionTheoryFolderComponent } from './disruption-theory-folder.component';
import { GlobalSearchFormModule, GlobalSearchResultModule, SharedServiceModule, PreviewDialogModule } from '@pages/shared';
import { DisruptionFoldersViewModule } from '../disruption-folders-view/disruption-folders-view.module';
import { DisruptionFormFoldersModule } from '../../shared/disruption-form-folders/disruption-form-folders.module';
import { DisruptionFormTheoryFolderDialogComponent } from './disruption-form-theory-folder-body/disruption-form-theory-folder-dialog.component';
import { DisruptionFormTheoryModule } from '@pages/shared/disruption-form-theory/disruption-form-theory.module';

@NgModule({
  imports: [
    ThemeModule,
    PreviewDialogModule,
    CommonModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    DisruptionFoldersViewModule,
    DisruptionFormTheoryModule,
    DisruptionFormFoldersModule,
  ],
  declarations: [
    DisruptionTheoryFolderComponent,
    DisruptionFormTheoryFolderDialogComponent,
  ],
  providers: [
    ...SharedServiceModule.forRoot().providers,
  ],
})
export class DisruptionTheoryFolderModule { }
