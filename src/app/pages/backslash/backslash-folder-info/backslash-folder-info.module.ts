import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NbSpinnerModule } from '@core/nebular/theme';
import { BackslashFolderInfoComponent } from './backslash-folder-info.component';
import { GlobalDocumentDialogModule } from '@pages/shared';

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
