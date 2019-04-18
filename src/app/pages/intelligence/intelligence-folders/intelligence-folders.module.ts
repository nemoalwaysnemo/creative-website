import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { GlobalSearchFormModule, GlobalSearchResultModule, SharedServiceModule } from '@pages/shared';
import { IntelligenceFoldersComponent } from './intelligence-folders.component';
import { IntelligencenFoldersViewModule } from '../intelligence-shared/intelligence-folders-view/intelligence-folders-view.module';

@NgModule({
  imports: [
    ThemeModule,
    CommonModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    IntelligencenFoldersViewModule,
  ],
  declarations: [
    IntelligenceFoldersComponent,
  ],
  providers: [
    ...SharedServiceModule.forRoot().providers,
  ],
})
export class IntelligenceFoldersModule { }
