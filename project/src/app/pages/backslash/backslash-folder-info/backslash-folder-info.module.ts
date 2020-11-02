import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NbSpinnerModule } from '@core/nebular/theme';
import { GlobalDocumentDialogModule } from '@pages/shared';
import { BackslashFolderInfoComponent } from './backslash-folder-info.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NbSpinnerModule,
    GlobalDocumentDialogModule,
  ],
  declarations: [
    BackslashFolderInfoComponent,
  ],
  exports: [
    BackslashFolderInfoComponent,
  ],
})

export class BackslashFolderInfoModule {

}
