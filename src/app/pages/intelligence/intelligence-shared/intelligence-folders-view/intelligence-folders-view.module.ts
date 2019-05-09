import { NgModule } from '@angular/core';
import { NbSpinnerModule } from '@core/nebular/theme';
import { CommonModule } from '@angular/common';
import { IntelligenceFoldersViewComponent } from './intelligence-folders-view.component';

@NgModule({
  imports: [
    CommonModule,
    NbSpinnerModule,
  ],
  declarations: [
    IntelligenceFoldersViewComponent,
  ], exports: [
    IntelligenceFoldersViewComponent,
  ],
})

export class IntelligenceFoldersViewModule {

}
