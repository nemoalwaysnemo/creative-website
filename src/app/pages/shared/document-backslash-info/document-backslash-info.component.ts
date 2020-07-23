import { Component, Input, OnDestroy } from '@angular/core';
import { DocumentModel, NuxeoQuickFilters, NuxeoPagination } from '@core/api';
import { assetPath } from '@core/services/helpers';
import { DocumentPageService } from '../services/document-page.service';
import { Subscription } from 'rxjs';
import { NUXEO_PATH_INFO } from '@environment/environment';

@Component({
  selector: 'document-backslash-info',
  styleUrls: ['./document-backslash-info.component.scss'],
  templateUrl: './document-backslash-info.component.html',
})

export class DocumentBackslashInfoComponent implements OnDestroy {

  protected subscription: Subscription = new Subscription();

  backslashEdges: DocumentModel[] = [];

  loading: boolean = true;

  doc: DocumentModel;

  shareUrl: string;

  @Input() moreInfo: boolean = true;

  @Input() set document(doc: DocumentModel) {
    if (doc) {
      this.doc = doc;
      this.buildBackslashEdges(doc);
      this.shareUrl = this.buildShareUrl(doc);
    }
  }

  constructor(private documentPageService: DocumentPageService) {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  previewBtnImage(): string {
    return assetPath('assets/images/preview_logo.png');
  }

  buildBackslashEdges(doc: DocumentModel): void {
    const edgesParams = this.getEdgesAggParams(doc);
    if (edgesParams) {
      const params: any = {
        // app_edges_active_article: true,
        app_edges_tags_edges: edgesParams,
        quickFilters: NuxeoQuickFilters.BackslashEdgePage,
        ecm_path: NUXEO_PATH_INFO.BACKSLASH_BASE_FOLDER_PATH,
      };

      this.loading = true;
      const subscription = this.documentPageService.advanceRequest(params).subscribe((res: NuxeoPagination) => {
        this.loading = false;
        this.backslashEdges = res.entries;
      });
      this.subscription.add(subscription);
    } else {
      this.loading = false;
      this.backslashEdges = [];
    }
  }

  private getEdgesAggParams(doc: DocumentModel): string {
    const edges = doc.get('app_Edges:Tags_edges');
    return edges.length !== 0 ? `["${edges.join('", "')}"]` : '';
  }

  private buildShareUrl(doc: DocumentModel): string {
    return this.documentPageService.getCurrentAppUrl('backslash/asset/' + doc.uid);
  }
}
