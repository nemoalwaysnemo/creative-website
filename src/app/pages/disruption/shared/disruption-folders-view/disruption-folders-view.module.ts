import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DisruptionFoldersViewComponent } from './disruption-folders-view.component';
@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    RouterModule,
  ],
  declarations: [
    DisruptionFoldersViewComponent,
  ], exports: [
    DisruptionFoldersViewComponent,
  ],
})

export class DisruptionFoldersViewModule {

}
