import { Component } from '@angular/core';
import { parseCountry } from '@core/services/helpers';
import { Observable, of as observableOf, combineLatest } from 'rxjs';
import { concatMap, map, share } from 'rxjs/operators';
import { DocumentModel, UserModel, NuxeoPermission } from '@core/api';
import { DocumentPageService } from '../../../services/document-page.service';
import { GlobalDocumentDialogService } from '../../global-document-dialog.service';
import { DocumentDialogPreviewTemplateComponent } from '../../document-dialog-preview-template.component';

@Component({
  selector: 'creative-asset-preview-dialog',
  styleUrls: ['./creative-asset-preview-dialog.component.scss', '../global-document-dialog-template.scss'],
  templateUrl: './creative-asset-preview-dialog.component.html',
})
export class CreativeAssetPreviewDialogComponent extends DocumentDialogPreviewTemplateComponent {

  shareUrl: string = this.documentPageService.getCurrentFullUrl();

  downloadPermission$: Observable<boolean> = observableOf(false);

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
      this.shareUrl = this.buildShareUrl(doc);
      this.attachments = doc.getAttachmentList();
      this.downloadPermission$ = this.canDownloadCreativeAsset(doc);
    }
  }

  parseCountry(list: string[]): string {
    return parseCountry(list);
  }

  buildShareUrl(doc: DocumentModel): string {
    return this.documentPageService.getCurrentAppUrl('creative/asset/' + doc.uid);
  }

  canDownloadCreativeAsset(doc: DocumentModel): Observable<boolean> {
    return combineLatest(
      doc.hasPermission(NuxeoPermission.ReadWrite),
      doc.hasPermission(NuxeoPermission.Everything),
      this.documentPageService.getCurrentUser().pipe(
        concatMap((user: UserModel) => doc.getParentPropertyByOperation('app_global:download_mainfile').pipe(
          map((permission: boolean) => user.canAccess() && permission === true),
        )),
      ), (one, two, three) => {
        return one || two || three;
      }).pipe(
        share(),
      );
  }
}
