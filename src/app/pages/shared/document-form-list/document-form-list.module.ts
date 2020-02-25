import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DocumentFormListComponent } from './document-form-list.component';
import { DocumentFormListCellComponent } from './document-form-list-cell.component';
import { DocumentFormListRowComponent } from './document-form-list-row.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  declarations: [
    DocumentFormListComponent,
    DocumentFormListRowComponent,
    DocumentFormListCellComponent,
  ],
  exports: [
    DocumentFormListComponent,
  ],
})
export class DocumentFormListModule { }
