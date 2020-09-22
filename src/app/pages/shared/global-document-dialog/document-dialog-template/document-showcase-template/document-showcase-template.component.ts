import { Component } from '@angular/core';
import { DocumentModel } from '@core/api';
import { Observable, forkJoin, BehaviorSubject } from 'rxjs';
import { DocumentDialogCustomTemplateComponent } from '../../document-dialog-custom-template.component';
import { DocumentPageService } from '../../../services/document-page.service';
import { GlobalDocumentDialogService } from '../../global-document-dialog.service';
import { SelectableItemService } from '../../../selectable-item/selectable-item.service';

@Component({
  selector: 'document-showcase-template',
  templateUrl: './document-showcase-template.component.html',
  styleUrls: ['../global-document-dialog-template.scss'],
})
export class DocumentShowcaseTemplateComponent extends DocumentDialogCustomTemplateComponent {

  private documents$: BehaviorSubject<DocumentModel[]> = new BehaviorSubject<DocumentModel[]>([]);

  properties: any;

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

  private addToShowcase(): void {
    this.properties = { 'app_global:networkshare': true };
    this.updateDocuments(this.documents$.value).subscribe((models: DocumentModel[]) => {
      this.globalDocumentDialogService.close();
      // this.selectableItemService.clear();
      this.documentPageService.notify(`Added to Showcase successfully!`, 'Added to Showcase successfully!', 'success');
    });
  }

  private removeFromShowcase(): void {
    this.properties = { 'app_global:networkshare': false };
    this.updateDocuments(this.documents$.value).subscribe((models: DocumentModel[]) => {
      this.globalDocumentDialogService.close();
      this.selectableItemService.clear();
      this.refresh(this.documentPageService.getCurrentUrl());
      this.documentPageService.notify(`Removed from Showcase successfully!`, 'Removed from Showcase successfully!', 'success');
    });
  }

  private updateDocuments(documents: DocumentModel[]): Observable<DocumentModel[]> {
    return forkJoin(...documents.map(x => this.updateDocument(x, this.properties)));
  }

  private updateDocument(doc: DocumentModel, properties: any = {}): Observable<DocumentModel> {
    return doc.set(properties).save();
  }
}
