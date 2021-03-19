import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgFileModule } from '@core/custom';
import { DragDropFileZoneService } from './drag-drop-file-zone.service';
import { DragDropFileZoneComponent } from './drag-drop-file-zone.component';

@NgModule({
  imports: [
    NgFileModule,
    CommonModule,
  ],
  declarations: [
    DragDropFileZoneComponent,
  ],
  providers: [
    DragDropFileZoneService,
  ],
  exports: [
    DragDropFileZoneComponent,
  ],
})

export class DragDropFileZoneModule {
}
