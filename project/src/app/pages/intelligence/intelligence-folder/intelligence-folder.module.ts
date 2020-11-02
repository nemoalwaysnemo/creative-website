import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { GlobalSearchFormModule, GlobalSearchResultModule } from '@pages/shared';
import { IntelligenceFolderComponent } from './intelligence-folder.component';
import { IntelligenceFolderViewModule } from '../intelligence-shared/intelligence-folder-view/intelligence-folder-view.module';

@NgModule({
  imports: [
    ThemeModule,
    CommonModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    IntelligenceFolderViewModule,
  ],
  declarations: [
    IntelligenceFolderComponent,
  ],
})
export class IntelligenceFolderModule { }
