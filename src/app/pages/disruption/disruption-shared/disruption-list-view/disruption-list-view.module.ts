import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { CommonModule } from '@angular/common';
import { DisruptionListViewComponent } from './disruption-list-view.component';
import { PaginationModule } from 'app/pages/shared/pagination/pagination.module';
import { SharedModule } from '@pages/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    ThemeModule,
    PaginationModule,
  ],
  declarations: [
    DisruptionListViewComponent,
  ], exports: [
    DisruptionListViewComponent,
  ],
})

export class DisruptionListViewModule {

}
