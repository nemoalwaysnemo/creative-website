import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { CommonModule } from '@angular/common';
import { DisruptionRoadsViewComponent } from './disruption-roads-view.component';
import { PaginationModule } from 'app/pages/shared/pagination/pagination.module';
import { SharedModule } from '@pages/shared/shared.module';
import { DocumentViewerModule } from '@pages/shared';
import { RoadmapsDialogComponent } from './roadmaps-body/roadmaps-dialog.component';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    ThemeModule,
    PaginationModule,
    DocumentViewerModule,
  ],
  declarations: [
    DisruptionRoadsViewComponent,
    RoadmapsDialogComponent,
  ], exports: [
    DisruptionRoadsViewComponent,
  ],
})

export class DisruptionRoadsViewModule {

}
