import { Component, Input, OnInit } from '@angular/core';
import { DocumentModel } from '@core/api';
import { NbToastrService } from '@core/nebular/theme';
import { DocumentDialogCustomTemplateComponent } from '../../document-dialog-custom-template.component';
import { DocumentPageService } from '../../../services/document-page.service';
import { GlobalDocumentDialogService } from '../../global-document-dialog.service';
import { Observable, forkJoin } from 'rxjs';

@Component({
  selector: 'document-showcase-template',
  templateUrl: './document-showcase-template.component.html',
  styleUrls: ['../global-document-dialog-template.scss'],
})
export class DocumentShowcaseTemplateComponent extends DocumentDialogCustomTemplateComponent {

  // documents: DocumentModel[];

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected documentPageService: DocumentPageService,
    private toastrService: NbToastrService,
  ) {
    super(globalDocumentDialogService, documentPageService);
  }


  private addToShowcase(): void {
    const docs = this.document.map((doc: DocumentModel) => doc);
    this.updateDocuments(docs).subscribe((models: DocumentModel[]) => {
      this.toastrService.show(`Added successfully!`, '', { status: 'success' });
    });
  }

  private updateDocuments(documents: DocumentModel[]): Observable<DocumentModel[]> {
    const properties = { 'app_global:networkshare': true }
    return forkJoin(...documents.map(x => this.updateDocument(x, properties)));
  }

  private updateDocument(doc: DocumentModel, properties: any = {}): Observable<DocumentModel> {
    return doc.set(properties).save();
  }

  // delete(): void {
  //   this.deleteDocument(this.document).subscribe(_ => {
  //     this.confirm(false, 300);
  //     this.moveRefresh();
  //   });
  // }
  //
  // private deleteDocument(model: DocumentModel): Observable<DocumentModel> {
  //   return model.moveToTrash();
  // }
  //
  // private moveRefresh(): void {
  //   if (!this.redirectUrl) {
  //     this.documentPageService.historyBack();
  //   } else {
  //     this.refresh();
  //   }
  // }

}
