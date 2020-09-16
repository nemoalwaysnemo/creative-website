import { Component, Input, OnDestroy, Type } from '@angular/core';
import { DocumentModel, NuxeoQuickFilters, NuxeoPagination, NuxeoPermission, NuxeoApiService, NuxeoAutomations } from '@core/api';
import { assetPath } from '@core/services/helpers';
import { DocumentPageService } from '../services/document-page.service';
import { Observable, of as observableOf, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { GlobalDocumentDialogService } from '../global-document-dialog/global-document-dialog.service';
import { NUXEO_PATH_INFO } from '@environment/environment';
import { GLOBAL_DOCUMENT_FORM } from '../global-document-form';
import { DocumentVideoViewerService, DocumentVideoEvent } from '../document-viewer/document-video-viewer/document-video-viewer.service';

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

  @Input() moreInfo: boolean = true;

  @Input() set document(doc: DocumentModel) {
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
    private nuxeoApi: NuxeoApiService,
    private documentVideoViewerService: DocumentVideoViewerService,
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    private documentPageService: DocumentPageService,
  ) {
    this.subscribeServiceEvent();
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

  newThumbnail(currentTime: number): void {
    if (typeof currentTime === 'number') {
      const duration = (currentTime * 10).toString();
      const subscription = this.nuxeoApi.operation(NuxeoAutomations.GetVideoScreenshot, { duration }, this.doc.uid).subscribe((doc: DocumentModel) => {
        this.documentPageService.notify(`Video poster has been updated successfully!`, '', 'success');
        this.documentPageService.refresh(500);
      });
      this.subscription.add(subscription);
    }
  }

  protected subscribeServiceEvent(): void {
    const subscription = this.documentVideoViewerService.onEvent().pipe(
      filter((e: DocumentVideoEvent) => this.enableThumbnailCreation && ['videoPlaying', 'videoPause'].includes(e.name)),
    ).subscribe((e: DocumentVideoEvent) => {
      if (e.name === 'videoPause') {
        this.videoCurrentTime = e.currentTime;
      } else if ('videoPlaying') {
        this.videoCurrentTime = null;
      }
    });
    this.subscription.add(subscription);
  }

}
