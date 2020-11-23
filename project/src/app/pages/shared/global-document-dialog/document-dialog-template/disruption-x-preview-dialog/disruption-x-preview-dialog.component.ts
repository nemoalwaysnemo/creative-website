import { Component } from '@angular/core';
import { DocumentModel } from '@core/api';
import { vocabularyFormatter } from '@core/services/helpers';
import { Observable, of as observableOf } from 'rxjs';
import { DocumentPageService } from '../../../services/document-page.service';
import { GlobalDocumentDialogService } from '../../global-document-dialog.service';
import { DocumentDialogPreviewTemplateComponent } from '../../document-dialog-preview-template.component';

@Component({
  selector: 'disruption-x-preview-dialog',
  templateUrl: './disruption-x-preview-dialog.component.html',
  styleUrls: ['./disruption-x-preview-dialog.component.scss', '../global-document-dialog-template.scss'],
})
export class DisruptionXPreviewDialogComponent extends DocumentDialogPreviewTemplateComponent {

  static readonly NAME: string = 'disruption-x-preview-dialog';

  writePermission$: Observable<boolean> = observableOf(false);

  deletePermission$: Observable<boolean> = observableOf(false);

  shareUrl: string = this.documentPageService.getCurrentFullUrl();

  attachments: { type: string, url: string, title: string }[] = [];

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected documentPageService: DocumentPageService,
  ) {
    super(globalDocumentDialogService, documentPageService);
  }

  protected setDocument(doc: DocumentModel): void {
    if (doc) {
      this.document = doc;
      this.attachments = this.document.getAttachmentList();
    }
  }

  getDialogFormTemplateName(doc: DocumentModel): string {
    const name: string = '';
    return name;
  }

  vocabularyFormatter(list: string[]): string {
    return vocabularyFormatter(list);
  }

  protected getPreviewSettings(): any {
    return {
      moreInfo: true,
      enablePreview: false,
      enableDetail: false,
      enableKnowledgeRelated: false,
    };
  }

  private buildShareUrl(doc: DocumentModel): string {
    return this.shareUrl;
  }

}
