import { Component, Input, OnDestroy } from '@angular/core';
import { DocumentModel, NuxeoQuickFilters, NuxeoPagination, AdvanceSearch } from '@core/api';
import { Environment, NUXEO_PATH_INFO } from '@environment/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'document-backslash-info',
  styleUrls: ['./document-backslash-info.component.scss'],
  templateUrl: './document-backslash-info.component.html',
})

export class DocumentBackslashInfoComponent implements OnDestroy {

  protected subscription: Subscription = new Subscription();

  backslashEdges: DocumentModel[] = [];

  loading: boolean = true;

  @Input() currentUrl: string;

  @Input() moreInfo: boolean = true;

  @Input() doc: DocumentModel;

  @Input() set document(doc: DocumentModel) {
    if (doc) {
      this.doc = doc;
      this.buildBackslashEdges(this.doc);
      this.currentUrl = this.buildShareUrl(this.doc.uid);
    }
  }

  constructor(private advanceSearch: AdvanceSearch) { }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  previewBtnImage(): string {
    return this.assetPath('assets/images/preview_logo.png');
  }

  buildBackslashEdges(doc: DocumentModel): void {
    const edgesParams = this.getEdgesAggParams(doc);
    if (edgesParams) {
      const params: any = {
        app_edges_active_article: true,
        app_edges_tags_edges: edgesParams,
        quickFilters: NuxeoQuickFilters.BackslashEdgePage,
        ecm_path: NUXEO_PATH_INFO.BACKSLASH_BASE_FOLDER_PATH,
      };

      this.loading = true;
      const subscription = this.advanceSearch.request(params).subscribe((res: NuxeoPagination) => {
        this.loading = false;
        this.backslashEdges = res.entries;
      });
      this.subscription.add(subscription);
    } else {
      this.loading = false;
      this.backslashEdges = [];
    }
  }

  protected assetPath(src: string): string {
    return Environment.assetPath + src;
  }

  private getEdgesAggParams(doc: DocumentModel): string {
    const edges = doc.get('app_Edges:Tags_edges');
    return edges.length !== 0 ? `["${edges.join('", "')}"]` : '';
  }

  private buildShareUrl(uid: string): string {
    this.currentUrl = window.location.href;
    const shareUrl = '/asset/' + uid;
    return this.currentUrl.indexOf('/home') > 0 ? this.currentUrl.split('/home')[0] + shareUrl : this.currentUrl;
  }
}
