import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { GlobalSearchFormModule, GlobalSearchResultModule } from '@pages/shared';
import { BackslashTriggerPoolViewComponent } from './backslash-trigger-pool-view.component';
import { BackslashFolderInfoModule } from '../backslash-folder-info/backslash-folder-info.module';
import { BackslashFormButtonModule } from '../backslash-form-button/backslash-form-button.module';

@NgModule({
  imports: [
    SharedModule,
    ThemeModule,
    CommonModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    BackslashFolderInfoModule,
    BackslashFormButtonModule,
  ],
  declarations: [
    BackslashTriggerPoolViewComponent,
  ],
})
export class BackslashTriggerPoolViewModule { }
