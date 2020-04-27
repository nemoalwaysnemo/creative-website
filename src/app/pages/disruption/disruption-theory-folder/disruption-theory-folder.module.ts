import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { DisruptionTheoryFolderComponent } from './disruption-theory-folder.component';
import { GlobalSearchFormModule, GlobalSearchResultModule } from '@pages/shared';
import { DisruptionFolderViewModule } from '../disruption-folder-view/disruption-folder-view.module';

@NgModule({
  imports: [
    ThemeModule,
    CommonModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    DisruptionFolderViewModule,
  ],
  declarations: [
    DisruptionTheoryFolderComponent,
  ],
})
export class DisruptionTheoryFolderModule { }
