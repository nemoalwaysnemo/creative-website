import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NbSpinnerModule } from '@core/nebular/theme';
import { IntelligenceFolderViewComponent } from './intelligence-folder-view.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NbSpinnerModule,
  ],
  declarations: [
    IntelligenceFolderViewComponent,
  ],
  exports: [
    IntelligenceFolderViewComponent,
  ],
})

export class IntelligenceFolderViewModule {

}
