import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { DisruptionFoldersComponent } from './disruption-folders.component';
import { GlobalSearchFormModule, GlobalSearchResultModule } from '@pages/shared';
import { DisruptionFoldersViewModule } from '../disruption-folders-view/disruption-folders-view.module';

@NgModule({
  imports: [
    ThemeModule,
    CommonModule,
    DisruptionFoldersViewModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
  ],
  declarations: [
    DisruptionFoldersComponent,
  ],
  providers: [
  ],
})
export class DisruptionFoldersModule { }
