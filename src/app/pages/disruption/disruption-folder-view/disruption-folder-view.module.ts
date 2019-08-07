import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NbSpinnerModule } from '@core/nebular/theme';
import { DisruptionFolderViewComponent } from './disruption-folder-view.component';
import { PreviewDialogModule, DisruptionFormDayModule, DisruptionFormTheoryModule } from '@pages/shared';
import { DisruptionFormFolderEditDialogComponent } from './disruption-folder-form-body/disruption-folder-edit-from-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NbSpinnerModule,
    PreviewDialogModule,
    DisruptionFormDayModule,
    DisruptionFormTheoryModule,
  ],
  declarations: [
    DisruptionFolderViewComponent,
    DisruptionFormFolderEditDialogComponent,
  ],
  exports: [
    DisruptionFolderViewComponent,
    DisruptionFormFolderEditDialogComponent,
  ],
})

export class DisruptionFolderViewModule {

}
