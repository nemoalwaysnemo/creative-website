import { NgModule } from '@angular/core';
import { NbSpinnerModule } from '@core/nebular/theme';
import { CommonModule } from '@angular/common';
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
