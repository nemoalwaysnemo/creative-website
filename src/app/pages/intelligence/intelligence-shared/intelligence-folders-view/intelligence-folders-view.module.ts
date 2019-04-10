import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IntelligenceFoldersViewComponent } from './intelligence-folders-view.component';
@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    RouterModule,
  ],
  declarations: [
    IntelligenceFoldersViewComponent,
  ], exports: [
    IntelligenceFoldersViewComponent,
  ],
})

export class IntelligencenFoldersViewModule {

}
