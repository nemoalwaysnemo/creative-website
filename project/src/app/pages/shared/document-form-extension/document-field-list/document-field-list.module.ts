import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DocumentFieldListComponent } from './document-field-list.component';
import { DocumentFieldListCellComponent } from './document-field-list-cell.component';
import { DocumentFieldListRowComponent } from './document-field-list-row.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  declarations: [
    DocumentFieldListComponent,
    DocumentFieldListRowComponent,
    DocumentFieldListCellComponent,
  ],
  exports: [
    DocumentFieldListComponent,
  ],
})
export class DocumentFieldListModule { }
