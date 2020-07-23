import { Component } from '@angular/core';
import { DocumentModel } from '@core/api';
import { parseCountry } from '@core/services/helpers';
import { DocumentPageService } from '../../../services/document-page.service';
import { GlobalDocumentDialogService } from '../../global-document-dialog.service';
import { DocumentDialogPreviewTemplateComponent } from '../../document-dialog-preview-template.component';
import { NUXEO_PATH_INFO } from '@environment/environment';

@Component({
  selector: 'innovation-asset-preview-dialog',
  styleUrls: ['./innovation-asset-preview-dialog.component.scss', '../global-document-dialog-template.scss'],
  templateUrl: './innovation-asset-preview-dialog.component.html',
})
export class InnovationAssetPreviewDialogComponent extends DocumentDialogPreviewTemplateComponent {

  shareUrl: string = this.documentPageService.getCurrentFullUrl();

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected documentPageService: DocumentPageService,
  ) {
    super(globalDocumentDialogService, documentPageService);
  }

  protected setDocument(doc: DocumentModel): void {
    if (doc) {
      this.document = doc;
      this.shareUrl = this.buildShareUrl(doc);
    }
  }

  parseCountry(list: string[]): string {
    return parseCountry(list);
  }

  buildShareUrl(doc: DocumentModel): string {
    let url: string;
    if (doc.path.includes(NUXEO_PATH_INFO.INNOVATION_BASE_FOLDER_PATH + 'NEXT')) {
      url = 'innovation/NEXT/folder/';
    } else if (doc.path.includes(NUXEO_PATH_INFO.INNOVATION_BASE_FOLDER_PATH + 'Things to Steal')) {
      url = 'innovation/Things to Steal/folder/';
    }
    if (doc.type === 'App-Innovation-Asset') {
      url = url + ':parentRef/asset/';
    }
    return this.documentPageService.getCurrentAppUrl(url.replace(':parentRef', doc.parentRef) + doc.uid);
  }

  protected getPreviewSettings(): any {
    return {
      moreInfo: true,
      enablePreview: true,
    };
  }

}