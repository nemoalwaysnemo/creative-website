import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { GlobalSearchFormModule, GlobalSearchResultModule } from '@pages/shared';
import { BizDevOpportunityFolderComponent } from './biz-dev-opportunity-folder.component';
import { BizDevFolderViewModule } from '../biz-dev-folder-view/biz-dev-folder-view.module';
import { BizDevFormButtonModule } from '../biz-dev-form-button/biz-dev-form-button.module';
@NgModule({
  imports: [
    ThemeModule,
    CommonModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    BizDevFolderViewModule,
    BizDevFormButtonModule,
  ],
  declarations: [
    BizDevOpportunityFolderComponent,
  ],
})
export class BizDevOpportunityFolderModule { }
