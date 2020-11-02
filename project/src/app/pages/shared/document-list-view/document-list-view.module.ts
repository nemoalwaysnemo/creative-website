import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ng2SmartTableModule } from '@core/custom';
import { NbSpinnerModule } from '@core/nebular/theme';
import { DocumentListViewComponent } from './document-list-view.component';

@NgModule({
  imports: [
    CommonModule,
    NbSpinnerModule,
    Ng2SmartTableModule,
  ],
  declarations: [
    DocumentListViewComponent,
  ],
  exports: [
    DocumentListViewComponent,
  ],
})
export class DocumentListViewModule {

}
