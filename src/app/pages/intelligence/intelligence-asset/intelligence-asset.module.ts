import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@pages/shared/shared.module';
import { IntelligenceAssetComponent } from './intelligence-asset.component';
import { IntelligencenFoldersViewModule } from '../intelligence-shared/intelligence-folders-view/intelligence-folders-view.module';

@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    RouterModule,
    IntelligencenFoldersViewModule,
  ],
  declarations: [
    IntelligenceAssetComponent,
  ],
})
export class IntelligenceAssetModule { }
