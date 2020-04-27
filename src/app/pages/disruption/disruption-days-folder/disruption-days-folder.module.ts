import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { DisruptionDaysFolderComponent } from './disruption-days-folder.component';
import { GlobalSearchFormModule, GlobalSearchResultModule } from '@pages/shared';
import { DisruptionFolderViewModule } from '../disruption-folder-view/disruption-folder-view.module';
import { DisruptionFormButtonModule } from '../disruption-form-button/disruption-form-button.module';

@NgModule({
  imports: [
    ThemeModule,
    CommonModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    DisruptionFolderViewModule,
    DisruptionFormButtonModule,
  ],
  declarations: [
    DisruptionDaysFolderComponent,
  ],
})
export class DisruptionDaysFolderModule { }
