import { Component } from '@angular/core';
import { DocumentModel } from '@core/api';
import { parseCountry } from '@core/services/helpers';
import { DocumentPageService } from '../../../services/document-page.service';
import { GlobalDocumentDialogService } from '../../global-document-dialog.service';
import { DocumentDialogPreviewTemplateComponent } from '../../document-dialog-preview-template.component';

@Component({
  selector: 'innovation-asset-preview-dialog',
  styleUrls: ['./innovation-asset-preview-dialog.component.scss', '../global-document-dialog-template.scss'],
  templateUrl: './innovation-asset-preview-dialog.component.html',
})
export class InnovationAssetPreviewDialogComponent extends DocumentDialogPreviewTemplateComponent {

  currentUrl: string = this.documentPageService.getCurrentFullUrl();

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected documentPageService: DocumentPageService,
  ) {
    super(globalDocumentDialogService, documentPageService);
  }

  protected setDocument(doc: DocumentModel): void {
    if (doc) {
      this.document = doc;
      this.currentUrl = this.buildShareUrl(doc);
    }
  }

  parseCountry(list: string[]): string {
    return parseCountry(list);
  }

  buildShareUrl(doc: DocumentModel): string {
    let url: string = this.currentUrl.split('/p/')[0];
    url += '/p/innovation/asset/' + doc.uid;
    return url;
  }

  protected getPreviewSettings(): any {
    return {
      moreInfo: true,
      enablePreview: true,
    };
  }

}
