import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { DisruptionTheoryFolderComponent } from './disruption-theory-folder.component';
import { GlobalSearchFormModule, GlobalSearchResultModule, PreviewDialogModule } from '@pages/shared';
import { DisruptionFolderViewModule } from '../disruption-folder-view/disruption-folder-view.module';
import { DisruptionFormFolderModule } from '../../shared/disruption-form-folder/disruption-form-folder.module';
import { DisruptionFormTheoryFolderDialogComponent } from './disruption-form-theory-folder-body/disruption-form-theory-folder-dialog.component';
import { DisruptionFormTheoryModule } from '@pages/shared/disruption-form-theory/disruption-form-theory.module';

@NgModule({
  imports: [
    ThemeModule,
    PreviewDialogModule,
    CommonModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    DisruptionFolderViewModule,
    DisruptionFormTheoryModule,
    DisruptionFormFolderModule,
  ],
  declarations: [
    DisruptionTheoryFolderComponent,
    DisruptionFormTheoryFolderDialogComponent,
  ],
})
export class DisruptionTheoryFolderModule { }
