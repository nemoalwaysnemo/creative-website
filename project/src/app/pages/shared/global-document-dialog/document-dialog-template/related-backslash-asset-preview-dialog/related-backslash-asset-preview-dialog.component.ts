import { Component } from '@angular/core';
import { DocumentModel, NuxeoQuickFilters, NuxeoPagination } from '@core/api';
import { GlobalDocumentDialogService } from '../../global-document-dialog.service';
import { DocumentPageService } from '../../../services/document-page.service';
import { DocumentDialogPreviewTemplateComponent } from '../../document-dialog-preview-template.component';
import { NUXEO_PATH_INFO } from '@environment/environment';
import { matchAssetUrl } from '@core/services/helpers';

@Component({
  selector: 'related-backslash-asset-preview-dialog',
  styleUrls: ['../global-document-dialog-template.scss', './related-backslash-asset-preview-dialog.component.scss'],
  templateUrl: './related-backslash-asset-preview-dialog.component.html',
})
export class RelatedBackslashAssetDialogPreviewComponent extends DocumentDialogPreviewTemplateComponent {

  static readonly NAME: string = 'related-backslash-asset-preview';

  backslashEdges: DocumentModel[] = [];

  shareUrl: string;

  viewerSettings: any = {
    layout: this.getDialogSettings().docViewerLayout,
  };

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
    this.buildBackslashEdges(this.document);
    this.shareUrl = this.buildShareUrl(this.document);
  }

  previewBtnImage(): string {
    return '/assets/images/preview_logo.png';
  }

  private getEdgesAggParams(doc: DocumentModel): string {
    const edges = doc.get('app_Edges:Tags_edges');
    return edges.length !== 0 ? `["${edges.join('", "')}"]` : '';
  }

  private buildBackslashEdges(doc: DocumentModel): void {
    const edgesParams = this.getEdgesAggParams(doc);
    if (edgesParams) {
      const params: any = {
        // app_edges_active_article: true,
        app_edges_tags_edges: edgesParams,
        quickFilters: NuxeoQuickFilters.BackslashEdgePage,
        ecm_path: NUXEO_PATH_INFO.BACKSLASH_BASE_FOLDER_PATH,
      };
      const subscription = this.documentPageService.advanceRequest(params).subscribe((res: NuxeoPagination) => {
        this.backslashEdges = res.entries;
      });
      this.subscription.add(subscription);
    } else {
      this.backslashEdges = [];
    }
  }

  private buildShareUrl(doc: DocumentModel): string {
    return this.documentPageService.getCurrentAppUrl(matchAssetUrl(doc, this.assetUrlMapping) + doc.uid);
  }
}
