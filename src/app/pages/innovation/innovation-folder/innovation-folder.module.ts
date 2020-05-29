import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { GlobalSearchFormModule, GlobalSearchResultModule } from '@pages/shared';
import { InnovationFolderComponent } from './innovation-folder.component';
import { InnovationFormButtonModule } from '../innovation-form-button/innovation-form-button.module';
import { InnovationFolderViewModule } from '../innovation-folder-view/innovation-folder-view.module';
@NgModule({
  imports: [
    ThemeModule,
    CommonModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    InnovationFolderViewModule,
    InnovationFormButtonModule,
  ],
  declarations: [
    InnovationFolderComponent,
  ],
})
export class InnovationFolderModule { }
