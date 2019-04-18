import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { DisruptionFoldersComponent } from './disruption-folders.component';
import { GlobalSearchFormModule, GlobalSearchResultModule, SharedServiceModule } from '@pages/shared';
import { DisruptionFoldersViewModule } from '../disruption-folders-view/disruption-folders-view.module';

@NgModule({
  imports: [
    ThemeModule,
    CommonModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    DisruptionFoldersViewModule,
  ],
  declarations: [
    DisruptionFoldersComponent,
  ],
  providers: [
    ...SharedServiceModule.forRoot().providers,
  ],
})
export class DisruptionFoldersModule { }
