import { NgModule } from '@angular/core';
import { NbSpinnerModule } from '@core/nebular/theme';
import { CommonModule } from '@angular/common';
import { IntelligenceFolderViewComponent } from './intelligence-folder-view.component';

@NgModule({
  imports: [
    CommonModule,
    NbSpinnerModule,
  ],
  declarations: [
    IntelligenceFolderViewComponent,
  ], exports: [
    IntelligenceFolderViewComponent,
  ],
})

export class IntelligenceFolderViewModule {

}
