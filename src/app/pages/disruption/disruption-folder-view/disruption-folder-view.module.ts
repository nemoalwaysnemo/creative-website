import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NbSpinnerModule } from '@core/nebular/theme';
import { DisruptionFolderViewComponent } from './disruption-folder-view.component';
import { GlobalDocumentDialogModule } from '@pages/shared';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NbSpinnerModule,
    GlobalDocumentDialogModule,
  ],
  declarations: [
    DisruptionFolderViewComponent,
  ],
  exports: [
    DisruptionFolderViewComponent,
  ],
})

export class DisruptionFolderViewModule {

}
