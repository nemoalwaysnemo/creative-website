import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { GlobalSearchFormModule, GlobalSearchResultModule } from '@pages/shared';
import { BackslashEdgeFolderComponent } from './backslash-edge-folder.component';
import { BackslashTabInfoModule } from '../backslash-tab-info/backslash-tab-info.module';
import { BackslashFolderInfoModule } from '../backslash-folder-info/backslash-folder-info.module';
import { BackslashFormButtonModule } from '../backslash-form-button/backslash-form-button.module';
@NgModule({
  imports: [
    ThemeModule,
    CommonModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    BackslashFolderInfoModule,
    BackslashFormButtonModule,
    BackslashTabInfoModule,
  ],
  declarations: [
    BackslashEdgeFolderComponent,
  ],
})
export class BackslashEdgeFolderModule { }
