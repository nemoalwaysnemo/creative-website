import { Component } from '@angular/core';
import { DocumentModel, NuxeoPermission } from '@core/api';
import { Observable, forkJoin, zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { DocumentPageService } from '../../../services/document-page.service';
import { GlobalDocumentDialogService } from '../../global-document-dialog.service';
import { SelectableItemService } from '../../../selectable-item/selectable-item.service';
import { DocumentDialogCustomTemplateComponent } from '../../document-dialog-custom-template.component';

@Component({
  selector: 'document-delete-multiple-template',
  templateUrl: './document-delete-multiple-template.component.html',
  styleUrls: ['../global-document-dialog-template.scss'],
})
export class DocumentDeleteMultipleTemplateComponent extends DocumentDialogCustomTemplateComponent {

  documents: DocumentModel[] = [];

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
      const subscription = this.getValidDocuments(this.dialogSettings.documents).subscribe((docs: DocumentModel[]) => this.documents = docs);
      this.subscription.add(subscription);
    }
  }

  delete(): void {
    const subscription = this.deleteDocuments(this.documents).subscribe((models: DocumentModel[]) => {
      this.globalDocumentDialogService.close();
      this.selectableItemService.clear();
      this.refresh(this.documentPageService.getCurrentUrl());
      this.documentPageService.notify(`Assets Deleted!`, 'Assets Deleted!', 'success');
    });
    this.subscription.add(subscription);
  }

  private getValidDocuments(docs: DocumentModel[]): Observable<DocumentModel[]> {
    return forkJoin(
      docs.map((doc: DocumentModel) => zip(doc.hasPermission(NuxeoPermission.Write)),
      )).pipe(
        map((r: any[]) => {
          const list = [];
          r.forEach((b: boolean[], i: number) => { if (b.every((x: boolean) => x)) { list.push(docs[i]); } });
          return list;
        }),
      );
  }

  private deleteDocuments(documents: DocumentModel[]): Observable<DocumentModel[]> {
    return forkJoin(documents.map(x => x.moveToTrash()));
  }
}
