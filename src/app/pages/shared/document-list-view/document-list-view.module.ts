import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ng2SmartTableModule } from '@core/custom';
import { DocumentListViewComponent } from './document-list-view.component';
import { SharedDirectiveModule } from '../directives/shared-directive.module';
import { ThemeModule } from '@theme/theme.module';

@NgModule({
  imports: [
    CommonModule,
    Ng2SmartTableModule,
    SharedDirectiveModule,
    ThemeModule,
  ],
  declarations: [DocumentListViewComponent],
  exports: [
    DocumentListViewComponent,
  ],
})
export class DocumentListViewModule {

}
