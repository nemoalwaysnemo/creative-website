import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@pages/shared/shared.module';
import { IntelligenceAssetsComponent } from './intelligence-assets.component';
import { IntelligencenFoldersViewModule } from '../intelligence-shared/intelligence-folders-view/intelligence-folders-view.module';
@NgModule({
  imports: [
    ThemeModule,
    SharedModule,
    RouterModule,
    IntelligencenFoldersViewModule,
  ],
  declarations: [
    IntelligenceAssetsComponent,
  ],
  providers: [
    SharedModule.forRoot().providers,
  ],
})
export class IntelligenceAssetsModule { }
