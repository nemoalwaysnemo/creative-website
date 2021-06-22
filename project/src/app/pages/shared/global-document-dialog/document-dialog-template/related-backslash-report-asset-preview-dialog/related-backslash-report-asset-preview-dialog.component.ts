import { Component } from '@angular/core';
import { DocumentModel, NuxeoPermission} from '@core/api';
import { GlobalDocumentDialogService } from '../../global-document-dialog.service';
import { DocumentPageService } from '../../../services/document-page.service';
import { DocumentDialogPreviewTemplateComponent } from '../../document-dialog-preview-template.component';
import { vocabularyFormatter, matchAssetUrl } from '@core/services/helpers';
import { Observable, of as observableOf } from 'rxjs';
@Component({
  selector: 'related-backslash-report-asset-preview-dialog',
  styleUrls: ['../global-document-dialog-template.scss', './related-backslash-report-asset-preview-dialog.component.scss'],
  templateUrl: './related-backslash-report-asset-preview-dialog.component.html',
})
export class RelatedBackslashReportAssetDialogPreviewComponent extends DocumentDialogPreviewTemplateComponent {

  static readonly NAME: string = 'related-backslash-asset-preview';

  backslashEdges: DocumentModel[] = [];

  shareUrl: string;

  viewerSettings: any = {
    layout: this.getDialogSettings().docViewerLayout,
  };

  writePermission$: Observable<boolean> = observableOf(false);

  deletePermission$: Observable<boolean> = observableOf(false);

  private assetUrlMapping: any = {
    'App-Backslash-Edges-Asset': 'backslash/resource/edge/:parentRef/asset/',
    'App-Backslash-Case-Study': 'backslash/report/folder/:parentRef/asset/',
    'App-Backslash-Resources-Asset': 'backslash/resource/folder/:parentRef/asset/',
    'App-Edges-Trigger': 'backslash/Trigger Pool/asset/',
    '*': 'backslash/asset/',
  };

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected documentPageService: DocumentPageService,
  ) {
    super(globalDocumentDialogService, documentPageService);
  }

  protected onInit(): void {
    // this.buildBackslashEdges(this.document);
    this.shareUrl = this.buildShareUrl(this.document);
  }

  previewBtnImage(): string {
    return '/assets/images/preview_logo.png';
  }

  private buildShareUrl(doc: DocumentModel): string {
    return this.documentPageService.getCurrentAppUrl(matchAssetUrl(doc, this.assetUrlMapping) + doc.uid);
  }

  protected setDocument(doc: DocumentModel): void {
    if (doc) {
      this.document = doc;
      this.writePermission$ = doc.hasPermission(NuxeoPermission.Write);
      this.deletePermission$ = doc.hasPermission(NuxeoPermission.Delete);
    }
  }

  vocabularyFormatter(list: string[]): string {
    return vocabularyFormatter(list);
  }

  googleAnalyticsTrackLink(doc: DocumentModel, category: string, type: string = ''): void {
    this.documentPageService.googleAnalyticsTrackLink(doc, category, type);
  }
}
