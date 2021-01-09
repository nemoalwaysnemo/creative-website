import { Component } from '@angular/core';
import { DocumentModel, NuxeoPermission } from '@core/api';
import { vocabularyFormatter } from '@core/services/helpers';
import { Observable, of as observableOf } from 'rxjs';
import { DocumentPageService } from '../../../services/document-page.service';
import { GlobalDocumentDialogService } from '../../global-document-dialog.service';
import { DocumentDialogPreviewTemplateComponent } from '../../document-dialog-preview-template.component';
import { GLOBAL_DOCUMENT_FORM } from '../../../../shared/global-document-form';
import { NUXEO_PATH_INFO } from '@environment/environment';

@Component({
  selector: 'disruption-x-preview-dialog',
  templateUrl: './disruption-x-preview-dialog.component.html',
  styleUrls: ['./disruption-x-preview-dialog.component.scss', '../global-document-dialog-template.scss'],
})
export class DisruptionXPreviewDialogComponent extends DocumentDialogPreviewTemplateComponent {

  static readonly NAME: string = 'disruption-x-preview';

  writePermission$: Observable<boolean> = observableOf(false);

  deletePermission$: Observable<boolean> = observableOf(false);

  shareUrl: string = this.documentPageService.getCurrentFullUrl();

  attachments: { type: string, url: string, title: string }[] = [];

  enableThumbnailCreation: boolean = true;

  viewerSettings: any = {
    layout: this.getDialogSettings().docViewerLayout,
  };

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
      this.writePermission$ = this.getDocumentPermission(doc, NuxeoPermission.Write, this.getDialogSettings().enableEdit);
      this.deletePermission$ = this.getDocumentPermission(doc, NuxeoPermission.Delete, this.getDialogSettings().enableDeletion);
      this.shareUrl = this.buildShareUrl(doc);
    }
  }

  googleAnalyticsTrackLink(doc: DocumentModel, category: string, type: string = '', title: string = ''): void {
    this.documentPageService.googleAnalyticsTrackLink(doc, category, type, title);
  }

  getDialogFormTemplateName(doc: DocumentModel): string {
    let name: string = '';
    if (doc.type === 'App-DisruptionX-Module') {
      name = GLOBAL_DOCUMENT_FORM.DISRUPTION_X_MODULE_ASSET_FORM.NAME;
    }

    return name;
  }

  vocabularyFormatter(list: string[]): string {
    return vocabularyFormatter(list);
  }

  protected getPreviewSettings(): any {
    return {
      moreInfo: false,
      enableEdit: false,
      enableDeletion: false,
      enablePreview: false,
      enableDetail: false,
      enableKnowledgeRelated: false,
      enableThumbnailImg: false,
    };
  }

  private buildShareUrl(doc: DocumentModel): string {
    let url: string;
    if (doc.path.includes(NUXEO_PATH_INFO.DISRUPTION_X_FOLDER_PATH)) {
      url = 'disruption/asset/';
    }
    return this.documentPageService.getCurrentAppUrl(url.replace(':parentRef', doc.parentRef) + doc.uid);
  }

}
