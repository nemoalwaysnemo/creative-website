import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { BackslashAssetViewComponent } from './backslash-asset-view.component';
import { BackslashTabInfoModule } from '../backslash-tab-info/backslash-tab-info.module';
import { BackslashFolderInfoModule } from '../backslash-folder-info/backslash-folder-info.module';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    RouterModule,
    BackslashTabInfoModule,
    BackslashFolderInfoModule,
  ],
  declarations: [
    BackslashAssetViewComponent,
  ],
})
export class BackslashAssetViewModule { }
