import { Component } from '@angular/core';
import { DocumentModel } from '@core/api';
import { NbToastrService } from '@core/nebular/theme';
import { DocumentDialogCustomTemplateComponent } from '../../document-dialog-custom-template.component';
import { DocumentPageService } from '../../../services/document-page.service';
import { GlobalDocumentDialogService } from '../../global-document-dialog.service';
import { Observable, forkJoin, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'document-delete-multiple-template',
  templateUrl: './document-delete-multiple-template.component.html',
  styleUrls: ['../global-document-dialog-template.scss'],
})
export class DocumentDeleteMultipleTemplateComponent extends DocumentDialogCustomTemplateComponent {

  private documents$: BehaviorSubject<DocumentModel[]> = new BehaviorSubject<DocumentModel[]>([]);

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected documentPageService: DocumentPageService,
    private toastrService: NbToastrService,
  ) {
    super(globalDocumentDialogService, documentPageService);
  }

  protected onInit(): void {
    if (this.dialogSettings.documents) {
      this.documents$.next(this.dialogSettings.documents);
    }
  }

  delete(): void {
    this.deleteDocuments(this.documents$.value).subscribe((models: DocumentModel[]) => {
    this.confirm(false, 300);
    this.documentPageService.refresh();
    this.toastrService.show(`Assets Deleted!`, '', { status: 'success' });
    });
  }

  private deleteDocuments(documents: DocumentModel[]): Observable<DocumentModel[]> {
    return forkJoin(...documents.map(x => this.deleteDocument(x)));
  }

  private deleteDocument(doc: DocumentModel): Observable<DocumentModel> {
    return doc.moveToTrash();
  }
}
