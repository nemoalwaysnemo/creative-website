import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { GlobalSearchFormModule, GlobalSearchResultModule } from '@pages/shared';
import { BackslashEdgeFolderComponent } from './backslash-edge-folder.component';
import { BackslashFormButtonModule } from '../backslash-form-button/backslash-form-button.module';
import { BackslashFolderInfoModule } from '../backslash-folder-info/backslash-folder-info.module';
@NgModule({
  imports: [
    ThemeModule,
    CommonModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    BackslashFolderInfoModule,
    BackslashFormButtonModule,
  ],
  declarations: [
    BackslashEdgeFolderComponent,
  ],
})
export class BackslashEdgeFolderModule { }
