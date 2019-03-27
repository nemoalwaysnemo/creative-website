import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { CommonModule } from '@angular/common';
import { DisruptionListViewComponent } from './disruption-list-view.component';
import { PaginationModule } from 'app/pages/shared/pagination/pagination.module';
import { SharedModule } from '@pages/shared/shared.module';
import { DocumentViewerModule } from '@pages/shared';
import { RoadmapsDialogComponent } from '../../shared/disruption-roads-view/roadmaps-body/roadmaps-dialog.component';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    ThemeModule,
    PaginationModule,
    DocumentViewerModule,
  ],
  declarations: [
    DisruptionListViewComponent,
    RoadmapsDialogComponent,
  ], exports: [
    DisruptionListViewComponent,
  ],
})

export class DisruptionListViewModule {

}
