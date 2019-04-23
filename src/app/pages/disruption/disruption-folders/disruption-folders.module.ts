import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@theme/theme.module';
import { DisruptionFoldersComponent } from './disruption-folders.component';
import { GlobalSearchFormModule, GlobalSearchResultModule, SharedServiceModule, PreviewDialogModule } from '@pages/shared';
import { DisruptionFoldersViewModule } from '../disruption-folders-view/disruption-folders-view.module';
import { DisruptionFormFoldersDialogComponent } from '@pages/disruption/disruption-folders/disruption-form-folders-body/disruption-form-folders-dialog.component';
import { DisruptionFormFoldersModule } from '@pages/shared/disruption-form-folders/disruption-form-folders.module';

@NgModule({
  imports: [
    ThemeModule,
    PreviewDialogModule,
    CommonModule,
    GlobalSearchFormModule,
    GlobalSearchResultModule,
    DisruptionFoldersViewModule,
    DisruptionFormFoldersModule,
  ],
  declarations: [
    DisruptionFoldersComponent,
    DisruptionFormFoldersDialogComponent,
  ],
  providers: [
    ...SharedServiceModule.forRoot().providers,
  ],
})
export class DisruptionFoldersModule { }
