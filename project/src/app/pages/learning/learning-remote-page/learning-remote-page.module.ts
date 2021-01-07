import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbSpinnerModule } from '@core/nebular/theme';
import { LearningRemotePageComponent } from './learning-remote-page.component';

@NgModule({
  imports: [
    CommonModule,
    NbSpinnerModule,
  ],
  declarations: [
    LearningRemotePageComponent,
  ],
})
export class LearningRemotePageModule {
}
