import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@pages/shared/shared.module';
import { IntelligenceAssetComponent } from './intelligence-asset.component';
import { IntelligenceFolderViewModule } from '../intelligence-shared/intelligence-folder-view/intelligence-folder-view.module';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    IntelligenceFolderViewModule,
  ],
  declarations: [
    IntelligenceAssetComponent,
  ],
})
export class IntelligenceAssetModule { }
