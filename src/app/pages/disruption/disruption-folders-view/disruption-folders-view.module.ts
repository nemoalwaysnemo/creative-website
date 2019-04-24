import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbSpinnerModule } from '@core/nebular/theme';
import { DisruptionFoldersViewComponent } from './disruption-folders-view.component';

@NgModule({
  imports: [
    CommonModule,
    NbSpinnerModule,
  ],
  declarations: [
    DisruptionFoldersViewComponent,
  ], exports: [
    DisruptionFoldersViewComponent,
  ],
})

export class DisruptionFoldersViewModule {

}
