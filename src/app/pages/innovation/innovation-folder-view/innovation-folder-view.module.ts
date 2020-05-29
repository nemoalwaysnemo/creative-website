import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NbSpinnerModule } from '@core/nebular/theme';
import { InnovationFolderViewComponent } from './innovation-folder-view.component';
import { GlobalDocumentDialogModule } from '@pages/shared';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NbSpinnerModule,
    GlobalDocumentDialogModule,
  ],
  declarations: [
    InnovationFolderViewComponent,
  ],
  exports: [
    InnovationFolderViewComponent,
  ],
})

export class InnovationFolderViewModule {

}
