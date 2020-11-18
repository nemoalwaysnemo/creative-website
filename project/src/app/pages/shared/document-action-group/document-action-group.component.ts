import { Component, Input, TemplateRef } from '@angular/core';
import { getDocumentTypes } from '@core/services/helpers';
import { Observable, of as observableOf, combineLatest, Subscription, Subject } from 'rxjs';
import { concatMap, map, share, filter } from 'rxjs/operators';
import { DocumentPageService } from '../services/document-page.service';
import { DocumentModel, UserModel, NuxeoPermission, NuxeoApiService, NuxeoAutomations } from '@core/api';
import { GLOBAL_DOCUMENT_DIALOG, GlobalDocumentDialogSettings, GlobalDocumentDialogService } from '../global-document-dialog';
import { DocumentVideoViewerService, DocumentVideoEvent } from '../document-viewer/document-video-viewer/document-video-viewer.service';
import { NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'document-action-group',
  styleUrls: ['./document-action-group.component.scss'],
  templateUrl: './document-action-group.component.html',
})
export class DocumentActionGroupComponent {

  documentModel: DocumentModel;

  videoCurrentTime: number | null = null;

  dialogSettings: GlobalDocumentDialogSettings = new GlobalDocumentDialogSettings({ components: [GLOBAL_DOCUMENT_DIALOG.CUSTOM_DOWNLOAD_REQUEST] });

  document$: Subject<DocumentModel> = new Subject<DocumentModel>();

  writePermission$: Observable<boolean> = observableOf(false);

  downloadPermission$: Observable<boolean> = observableOf(false);

  protected subscription: Subscription = new Subscription();

  @Input() styleName: string;

  @Input() enableThumbnailCreation: boolean = false;

  @Input()
  set document(doc: DocumentModel) {
    if (doc) {
      this.documentModel = doc;
      this.document$.next(doc);
      if (this.isCreativeAsset(doc)) {
        this.downloadPermission$ = this.canDownloadCreativeAsset(doc);
      } else if (this.isBizDevCaseStudyAsset(doc)) {
        if (doc.get('app_global:asset_request') === false) {
          this.downloadPermission$ = observableOf(true);
        } else {
          this.downloadPermission$ = doc.hasPermission(NuxeoPermission.Write);
        }
      } else {
        this.downloadPermission$ = observableOf(true);
      }
      this.writePermission$ = doc.hasPermission(NuxeoPermission.Write);
    }
  }

  constructor(
    private nuxeoApi: NuxeoApiService,
    private documentPageService: DocumentPageService,
    private documentVideoViewerService: DocumentVideoViewerService,
    private globalDocumentDialogService: GlobalDocumentDialogService,
  ) {
    this.subscribeServiceEvent();
  }

  openDialog(dialog: TemplateRef<any>): void {
    this.globalDocumentDialogService.open(dialog);
  }

  isCreativeAsset(doc: DocumentModel): boolean {
    return doc && getDocumentTypes(NUXEO_DOC_TYPE.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES).includes(doc.type);
  }

  isBizDevCaseStudyAsset(doc: DocumentModel): boolean {
    return doc && getDocumentTypes(NUXEO_DOC_TYPE.BIZ_DEV_CASE_STUDIES_ASSET_TYPE).includes(doc.type);
  }

  isNeedSendDownloadRequest(doc: DocumentModel): boolean {
    return this.isBizDevCaseStudyAsset(doc) && doc.get('app_global:asset_request') === true;
  }

  isCreativeVideoAsset(doc: DocumentModel): boolean {
    if (this.isCreativeAsset(doc)) {
      return (doc.type === 'App-Library-Video') ? true : false;
    }
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

  goBack(): void {
    this.documentPageService.historyBack();
  }

  newThumbnail(currentTime: number): void {
    if (typeof currentTime === 'number') {
      const duration = (currentTime * 10).toString();
      const subscription = this.nuxeoApi.operation(NuxeoAutomations.GetVideoScreenshot, { duration }, this.documentModel.uid).subscribe((doc: DocumentModel) => {
        this.documentPageService.notify(`Video poster has been updated successfully!`, '', 'success');
        this.documentPageService.refresh(500);
      });
      this.subscription.add(subscription);
    }
  }

  protected subscribeServiceEvent(): void {
    const subscription = combineLatest([
      this.document$,
      this.documentVideoViewerService.onEvent().pipe(
        filter((e: DocumentVideoEvent) => this.enableThumbnailCreation && ['videoPause', 'videoSeeking', 'videoTimeUpdate'].includes(e.name)),
      ),
    ]).pipe(
      filter(([doc, event]: [DocumentModel, DocumentVideoEvent]) => event.docUid === doc.uid),
    ).subscribe(([doc, e]: [DocumentModel, DocumentVideoEvent]) => {
      this.videoCurrentTime = e.currentTime;
    });
    this.subscription.add(subscription);
  }
}