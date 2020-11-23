import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { DisruptionTheoryFolderComponent } from './disruption-theory-folder.component';
import { GlobalSearchFormModule, GlobalSearchResultModule } from '@pages/shared';
import { DisruptionTabInfoModule } from '../disruption-tab-info/disruption-tab-info.module';
import { DisruptionFolderViewModule } from '../disruption-folder-view/disruption-folder-view.module';
import { DisruptionFormButtonModule } from '../disruption-form-button/disruption-form-button.module';

@NgModule({
  imports: [
    ThemeModule,
    CommonModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    DisruptionTabInfoModule,
    DisruptionFolderViewModule,
    DisruptionFormButtonModule,
  ],
  declarations: [
    DisruptionTheoryFolderComponent,
  ],
})
export class DisruptionTheoryFolderModule { }
