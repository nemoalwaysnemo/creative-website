import { Component } from '@angular/core';
import { DocumentModel, NuxeoQuickFilters, NuxeoPagination } from '@core/api';
import { DocumentPageService } from '../../services/document-page.service';
import { GlobalDocumentDialogService } from '../../global-document-dialog';
import { DocumentPreviewInDialogBaseTemplateComponent } from '../document-preview-in-dialog-base-template.component';
import { NUXEO_PATH_INFO } from '@environment/environment';

@Component({
  selector: 'related-backslash-asset-preview-in-dialog',
  styleUrls: ['../../global-document-dialog/document-dialog-template/global-document-dialog-template.scss', './related-backslash-asset-preview-in-dialog.component.scss'],
  templateUrl: './related-backslash-asset-preview-in-dialog.component.html',
})
export class RelatedBackslashAssetInDialogPreviewComponent extends DocumentPreviewInDialogBaseTemplateComponent {

  backslashEdges: DocumentModel[] = [];

  constructor(
    protected documentPageService: DocumentPageService,
    protected globalDocumentDialogService: GlobalDocumentDialogService,
  ) {
    super(documentPageService, globalDocumentDialogService);
  }

  protected onInit(): void {
    this.buildBackslashEdges(this.document);
    this.shareUrl = this.buildShareUrl(this.document);
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
    return this.documentPageService.getCurrentAppUrl('backslash/asset/' + doc.uid);
  }
}
