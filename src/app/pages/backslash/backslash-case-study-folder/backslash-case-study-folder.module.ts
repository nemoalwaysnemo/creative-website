import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { GlobalSearchFormModule, GlobalSearchResultModule } from '@pages/shared';
import { BackslashCaseStudyFolderComponent } from './backslash-case-study-folder.component';
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
  ],
  declarations: [
    BackslashCaseStudyFolderComponent,
  ],
})
export class BackslashCaseStudyFolderModule { }
