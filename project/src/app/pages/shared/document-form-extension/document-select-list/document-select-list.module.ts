import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ListSearchFormInDialogModule } from '../../list-search-form-in-dialog';
import { DocumentSelectListComponent } from './document-select-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ListSearchFormInDialogModule,
  ],
  exports: [
    DocumentSelectListComponent,
  ],
  declarations: [
    DocumentSelectListComponent,
  ],
})
export class DocumentSelectListModule {

}
