import { NgModule } from '@angular/core';
import { BaseDocumentViewComponent } from './base-document-view.component';
import { BaseDocumentManageComponent } from './base-document-manage.component';
import { GlobalDocumentViewComponent } from './global-document-view.component';

@NgModule({
  declarations: [
    BaseDocumentManageComponent,
    BaseDocumentViewComponent,
    GlobalDocumentViewComponent,
  ],
  exports: [
    BaseDocumentManageComponent,
    BaseDocumentViewComponent,
    GlobalDocumentViewComponent,
  ],
})
export class AbstractClassesModule {
}
