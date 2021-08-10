import { Component } from '@angular/core';
import { DocumentModel, UserModel, NuxeoPermission } from '@core/api';
import { Observable, of as observableOf, combineLatest } from 'rxjs';
import { concatMap, map, share } from 'rxjs/operators';
import { vocabularyFormatter } from '@core/services/helpers';
import { DocumentPageService } from '../../services/document-page.service';
import { GlobalDocumentDialogService } from '../../global-document-dialog';
import { DocumentPreviewInDialogBaseTemplateComponent } from '../document-preview-in-dialog-base-template.component';

@Component({
  selector: 'creative-asset-preview-in-dialog',
  styleUrls: ['../../global-document-dialog/document-dialog-template/global-document-dialog-template.scss', './creative-asset-preview-in-dialog.component.scss'],
  templateUrl: './creative-asset-preview-in-dialog.component.html',
})
export class CreativeAssetPreviewInDialogComponent extends DocumentPreviewInDialogBaseTemplateComponent {

  attachments: { type: string; url: string; title: string }[] = [];

  downloadPermission$: Observable<boolean> = observableOf(false);

  viewerSettings: any = {
    layout: this.getDialogSettings().docViewerLayout,
  };

  constructor(
    protected documentPageService: DocumentPageService,
    protected globalDocumentDialogService: GlobalDocumentDialogService,
  ) {
    super(documentPageService, globalDocumentDialogService);
  }

  protected setDocument(doc: DocumentModel): void {
    if (doc) {
      this.document = doc;
      this.attachments = this.document.getAttachmentList();
      this.shareUrl = this.buildShareUrl(doc);
      this.downloadPermission$ = this.canDownloadCreativeAsset(doc);
    }
  }

  protected getPreviewSettings(): any {
    return {
      moreInfo: true,
      enablePreview: true,
      enableDetail: true,
      enableKnowledgeRelated: false,
    };
  }

  googleAnalyticsTrackLink(doc: DocumentModel, category: string, type: string = ''): void {
    this.documentPageService.googleAnalyticsTrackLink(doc, category, type);
  }

  vocabularyFormatter(list: string[]): string {
    return vocabularyFormatter(list);
  }

  buildShareUrl(doc: DocumentModel): string {
    return this.documentPageService.getCurrentAppUrl('creative/asset/' + doc.uid);
  }

  canDownloadCreativeAsset(doc: DocumentModel): Observable<boolean> {
    return combineLatest([
      doc.hasPermission(NuxeoPermission.ReadWrite),
      doc.hasPermission(NuxeoPermission.Everything),
      this.documentPageService.getCurrentUser().pipe(
        concatMap((user: UserModel) => doc.getParentPropertyByOperation('app_global:download_mainfile').pipe(
          map((permission: boolean) => user.canAccess() && permission === true),
        )),
      )]).pipe(
      map(results => (results[0] || results[1] || results[2])),
      share(),
    );
  }

  isVideoAsset(doc: DocumentModel): boolean {
    return (doc.type === 'App-Library-Video') ? true : false;
  }
}
