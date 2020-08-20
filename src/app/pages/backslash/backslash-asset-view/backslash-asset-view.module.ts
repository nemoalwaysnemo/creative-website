import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { BackslashFolderViewModule } from '../backslah-folder-view/backslash-folder-view.module';
import { BackslashAssetViewComponent } from './backslash-asset-view.component';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    RouterModule,
    BackslashFolderViewModule,
  ],
  declarations: [
    BackslashAssetViewComponent,
  ],
})
export class BackslashAssetViewModule { }
