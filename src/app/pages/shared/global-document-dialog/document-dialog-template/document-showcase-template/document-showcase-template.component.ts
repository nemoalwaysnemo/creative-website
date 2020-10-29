import { Component } from '@angular/core';
import { DocumentModel, NuxeoPermission } from '@core/api';
import { Observable, forkJoin, zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { DocumentPageService } from '../../../services/document-page.service';
import { GlobalDocumentDialogService } from '../../global-document-dialog.service';
import { SelectableItemService } from '../../../document-selectable';
import { DocumentDialogCustomTemplateComponent } from '../../document-dialog-custom-template.component';

@Component({
  selector: 'document-showcase-template',
  templateUrl: './document-showcase-template.component.html',
  styleUrls: ['../global-document-dialog-template.scss', './document-showcase-template.component.scss'],
})
export class DocumentShowcaseTemplateComponent extends DocumentDialogCustomTemplateComponent {

  documents: DocumentModel[] = [];

  showcaseSettings: any = { enableAddToShowcase: false, enableRemoveFromShowcase: false };

  constructor(
    private selectableItemService: SelectableItemService,
    protected documentPageService: DocumentPageService,
    protected globalDocumentDialogService: GlobalDocumentDialogService,
  ) {
    super(globalDocumentDialogService, documentPageService);
  }

  protected onInit(): void {
    if (this.dialogSettings.showcaseSettings) {
      this.showcaseSettings = this.dialogSettings.showcaseSettings;
    }
    if (this.dialogSettings.documents) {
      const subscription = this.getValidDocuments(this.dialogSettings.documents).subscribe((docs: DocumentModel[]) => this.documents = docs);
      this.subscription.add(subscription);
    }
  }

  addToShowcase(documents: DocumentModel[]): void {
    const subscription = this.updateDocuments(documents, { 'app_global:networkshare': true }).subscribe((models: DocumentModel[]) => {
      this.globalDocumentDialogService.close();
      this.documentPageService.notify(`Added to Showcase successfully!`, 'Added to Showcase successfully!', 'success');
    });
    this.subscription.add(subscription);
  }

  removeFromShowcase(documents: DocumentModel[]): void {
    const subscription = this.updateDocuments(documents, { 'app_global:networkshare': false }).subscribe((models: DocumentModel[]) => {
      this.globalDocumentDialogService.close();
      this.selectableItemService.clear();
      this.refresh(this.documentPageService.getCurrentUrl());
      this.documentPageService.notify(`Removed from Showcase successfully!`, 'Removed from Showcase successfully!', 'success');
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

  private updateDocuments(documents: DocumentModel[], properties: any = {}): Observable<DocumentModel[]> {
    return forkJoin(documents.map(doc => doc.set(properties).save()));
  }

}
