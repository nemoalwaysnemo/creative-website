import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { DocumentRouteTabsetModule, GlobalSearchFormModule, GlobalSearchResultModule } from '@pages/shared';
import { BackslashResourceFolderComponent } from './backslash-resource-folder.component';
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
    DocumentRouteTabsetModule,
  ],
  declarations: [
    BackslashResourceFolderComponent,
  ],
})
export class BackslashResourceFolderModule { }
