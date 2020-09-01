import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { BackslashFolderInfoModule } from '../backslash-folder-info/backslash-folder-info.module';
import { BackslashAssetViewComponent } from './backslash-asset-view.component';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    RouterModule,
    BackslashFolderInfoModule,
  ],
  declarations: [
    BackslashAssetViewComponent,
  ],
})
export class BackslashAssetViewModule { }
