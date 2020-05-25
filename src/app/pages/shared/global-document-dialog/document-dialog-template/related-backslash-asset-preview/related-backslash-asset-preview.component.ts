import { Component } from '@angular/core';
import { GlobalDocumentDialogService } from '../../global-document-dialog.service';
import { SearchQueryParamsService } from '../../../services/search-query-params.service';
import { DocumentDialogPreviewTemplateComponent } from '../../document-dialog-preview-template.component';
import { DocumentModel, NuxeoQuickFilters, NuxeoPagination, AdvanceSearch } from '@core/api';
import { NUXEO_PATH_INFO } from '@environment/environment';

@Component({
  selector: 'related-backslash-asset-preview',
  styleUrls: ['../global-document-dialog-template.scss', './related-backslash-asset-preview.component.scss'],
  templateUrl: './related-backslash-asset-preview.component.html',
})
export class RelatedBackslashAssetDialogPreviewComponent extends DocumentDialogPreviewTemplateComponent {

  static readonly NAME: string = 'related-backslash-asset-preview';

  backslashEdges: DocumentModel[] = [];

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected queryParamsService: SearchQueryParamsService,
    private advanceSearch: AdvanceSearch,
  ) {
    super(globalDocumentDialogService, queryParamsService);
  }

  protected onInit(): void {
    this.buildBackslashEdges(this.document);
  }

  previewBtnImage(): string {
    return this.assetPath('assets/images/preview_logo.png');
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
      const subscription = this.advanceSearch.request(params).subscribe((res: NuxeoPagination) => {
        this.backslashEdges = res.entries;
      });
      this.subscription.add(subscription);
    } else {
      this.backslashEdges = [];
    }
  }
}
