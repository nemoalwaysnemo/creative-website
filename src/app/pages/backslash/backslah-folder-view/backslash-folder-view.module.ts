import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NbSpinnerModule } from '@core/nebular/theme';
import { BackslashFolderViewComponent } from './backslash-folder-view.component';
import { GlobalDocumentDialogModule } from '../../shared';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NbSpinnerModule,
    GlobalDocumentDialogModule,
  ],
  declarations: [
    BackslashFolderViewComponent,
  ],
  exports: [
    BackslashFolderViewComponent,
  ],
})

export class BackslashFolderViewModule {

}
