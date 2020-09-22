import { Component } from '@angular/core';
import { DocumentModel } from '@core/api';
import { DocumentDialogCustomTemplateComponent } from '../../document-dialog-custom-template.component';
import { DocumentPageService } from '../../../services/document-page.service';
import { GlobalDocumentDialogService } from '../../global-document-dialog.service';
import { Observable, forkJoin, BehaviorSubject } from 'rxjs';
import { SelectableItemService } from '../../../selectable-item/selectable-item.service';

@Component({
  selector: 'document-delete-multiple-template',
  templateUrl: './document-delete-multiple-template.component.html',
  styleUrls: ['../global-document-dialog-template.scss'],
})
export class DocumentDeleteMultipleTemplateComponent extends DocumentDialogCustomTemplateComponent {

  private documents$: BehaviorSubject<DocumentModel[]> = new BehaviorSubject<DocumentModel[]>([]);

  redirectUrl: string = this.documentPageService.getCurrentUrl();

  constructor(
    private selectableItemService: SelectableItemService,
    protected documentPageService: DocumentPageService,
    protected globalDocumentDialogService: GlobalDocumentDialogService,
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
      this.globalDocumentDialogService.close();
      this.selectableItemService.clear();
      this.refresh(this.documentPageService.getCurrentUrl());
      this.documentPageService.notify(`Assets Deleted!`, 'Assets Deleted!', 'success');
    });
  }

  private deleteDocuments(documents: DocumentModel[]): Observable<DocumentModel[]> {
    return forkJoin(...documents.map(x => this.deleteDocument(x)));
  }

  private deleteDocument(doc: DocumentModel): Observable<DocumentModel> {
    return doc.moveToTrash();
  }
}
