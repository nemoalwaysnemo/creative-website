import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { RouterModule } from '@angular/router';
import { SharedServiceModule } from '@pages/shared';
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
  providers: [
    ...SharedServiceModule.forRoot().providers,
  ],
})
export class IntelligenceAssetModule { }
