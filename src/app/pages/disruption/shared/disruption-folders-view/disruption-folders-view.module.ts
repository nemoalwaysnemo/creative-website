import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { CommonModule } from '@angular/common';
import { DisruptionFoldersViewComponent } from './disruption-folders-view.component';
@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
  ],
  declarations: [
    DisruptionFoldersViewComponent,
  ], exports: [
    DisruptionFoldersViewComponent,
  ],
})

export class DisruptionFoldersViewModule {

}
