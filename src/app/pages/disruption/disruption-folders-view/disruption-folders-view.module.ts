import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NbSpinnerModule } from '@core/nebular/theme';
import { DisruptionFoldersViewComponent } from './disruption-folders-view.component';
import { PreviewDialogModule, DisruptionFormDayModule } from '@pages/shared';
import { DisruptionFormFoldersEditDialogComponent } from './disruption-folders-form-body/disruption-folders-edit-from-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NbSpinnerModule,
    PreviewDialogModule,
    DisruptionFormDayModule,
  ],
  declarations: [
    DisruptionFoldersViewComponent,
    DisruptionFormFoldersEditDialogComponent,
  ], exports: [
    DisruptionFoldersViewComponent,
    DisruptionFormFoldersEditDialogComponent,
  ],
})

export class DisruptionFoldersViewModule {

}
