import { Component, Input, OnDestroy } from '@angular/core';
import { DocumentModel, NuxeoQuickFilters, NuxeoPagination, NuxeoPermission } from '@core/api';
import { Observable, of as observableOf, Subscription } from 'rxjs';
import { GlobalDocumentDialogService } from '../global-document-dialog/global-document-dialog.service';
import { GLOBAL_DOCUMENT_FORM } from '../global-document-form';
import { DocumentPageService } from '../services/document-page.service';

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

  writePermission$: Observable<boolean> = observableOf(false);

  videoCurrentTime: number | null = null;

  enableThumbnailCreation: boolean = false;

  @Input() enableNewPoster: boolean = true;

  @Input() moreInfo: boolean = true;

  @Input()
  set document(doc: DocumentModel) {
    if (doc) {
      this.doc = doc;
      this.buildBackslashEdges(doc);
      this.shareUrl = this.buildShareUrl(doc);
      this.writePermission$ = doc.hasPermission(NuxeoPermission.Write);
      if (this.isBackslashHomePage()) {
        this.enableThumbnailCreation = true;
      }
    }
  }

  constructor(
    protected documentPageService: DocumentPageService,
    private globalDocumentDialogService: GlobalDocumentDialogService,
  ) { }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  previewBtnImage(): string {
    return '/assets/images/preview_logo.png';
  }

  buildBackslashEdges(doc: DocumentModel): void {
    const edgesParams = this.getEdgesAggParams(doc);
    if (edgesParams) {
      const params: any = {
        // app_edges_active_article: true,
        app_edges_tags_edges: edgesParams,
        quickFilters: NuxeoQuickFilters.BackslashEdgePage,
        ecm_path: this.documentPageService.getConfig('path:BACKSLASH_BASE_FOLDER_PATH'),
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

  getDialogFormTemplateName(doc: DocumentModel): string {
    let name: string = '';
    if (doc.type === 'App-Backslash-Article') {
      name = GLOBAL_DOCUMENT_FORM.BACKSLASH_ASSET_POST_FORM.NAME;
    } else if (doc.type === 'App-Backslash-Video') {
      name = GLOBAL_DOCUMENT_FORM.BACKSLASH_ASSET_VIDEO_FORM.NAME;
    }
    return name;
  }

  selectView(component: string): void {
    this.globalDocumentDialogService.selectView(component);
  }

  isBackslashHomePage(): boolean {
    const url = window.location.href.split('/');
    if (url.includes('backslash') && url.includes('home')) {
      return true;
    }
    return false;
  }

}
