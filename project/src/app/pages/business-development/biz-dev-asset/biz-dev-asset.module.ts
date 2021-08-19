import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@pages/shared/shared.module';
import { BizDevAssetComponent } from './biz-dev-asset.component';
import { BizDevFolderViewModule } from '../biz-dev-folder-view/biz-dev-folder-view.module';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    BizDevFolderViewModule,
  ],
  declarations: [
    BizDevAssetComponent,
  ],
})
export class BizDevAssetModule { }
