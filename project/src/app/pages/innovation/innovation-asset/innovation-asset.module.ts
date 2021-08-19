import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@pages/shared/shared.module';
import { InnovationAssetComponent } from './innovation-asset.component';
import { InnovationFolderViewModule } from '../innovation-folder-view/innovation-folder-view.module';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    InnovationFolderViewModule,
  ],
  declarations: [
    InnovationAssetComponent,
  ],
})
export class InnovationAssetModule { }
