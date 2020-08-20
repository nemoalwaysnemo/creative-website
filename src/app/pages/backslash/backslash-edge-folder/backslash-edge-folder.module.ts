import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { GlobalSearchFormModule, GlobalSearchResultModule } from '@pages/shared';
import { BackslashEdgeFolderComponent } from './backslash-edge-folder.component';
import { BackslashFolderViewModule } from '../backslah-folder-view/backslash-folder-view.module';
import { BackslashFormButtonModule } from '../backslash-form-button/backslash-form-button.module';
@NgModule({
  imports: [
    ThemeModule,
    CommonModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    BackslashFolderViewModule,
    BackslashFormButtonModule,
  ],
  declarations: [
    BackslashEdgeFolderComponent,
  ],
})
export class BackslashEdgeFolderModule { }
