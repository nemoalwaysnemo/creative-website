import { Component, Input, TemplateRef } from '@angular/core';
import { getDocumentTypes } from '@core/services/helpers';
import { Observable, of as observableOf, combineLatest } from 'rxjs';
import { concatMap, map, share } from 'rxjs/operators';
import { DocumentModel, UserService, UserModel, NuxeoPermission } from '@core/api';
import { GlobalDocumentDialogService } from '../global-document-dialog/global-document-dialog.service';
import { GLOBAL_DOCUMENT_DIALOG } from '../global-document-dialog';
import { SearchQueryParamsService } from '../services/search-query-params.service';
import { GlobalDocumentDialogSettings } from '../global-document-dialog/global-document-dialog.interface';
import { NUXEO_META_INFO } from '@environment/environment';

@Component({
  selector: 'document-action-group',
  styleUrls: ['./document-action-group.component.scss'],
  templateUrl: './document-action-group.component.html',
})
export class DocumentActionGroupComponent {

  documentModel: DocumentModel;

  dialogSettings: GlobalDocumentDialogSettings = new GlobalDocumentDialogSettings({ components: [GLOBAL_DOCUMENT_DIALOG.CUSTOM_DOWNLOAD_REQUEST] });

  downloadPermission$: Observable<boolean> = observableOf(false);

  @Input() styleName: string;

  @Input()
  set document(doc: DocumentModel) {
    if (doc) {
      this.documentModel = doc;
      if (this.isCreativeAsset(doc)) {
        this.downloadPermission$ = this.canDownloadCreativeAsset(doc);
      } else if (this.isBizDevCaseStudyAsset(doc)) {
        this.downloadPermission$ = observableOf(doc.get('app_global:asset_request') === false);
      } else {
        this.downloadPermission$ = observableOf(true);
      }
    }
  }

  constructor(
    private userService: UserService,
    private queryParamsService: SearchQueryParamsService,
    private globalDocumentDialogService: GlobalDocumentDialogService,
  ) {

  }

  openDialog(dialog: TemplateRef<any>): void {
    this.globalDocumentDialogService.open(dialog);
  }

  isCreativeAsset(doc: DocumentModel): boolean {
    return doc && getDocumentTypes(NUXEO_META_INFO.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES).includes(doc.type);
  }

  isBizDevCaseStudyAsset(doc: DocumentModel): boolean {
    return doc && getDocumentTypes(NUXEO_META_INFO.BIZ_DEV_CASE_STUDIES_ASSET_TYPE).includes(doc.type);
  }

  isNeedSendDownloadRequest(doc: DocumentModel): boolean {
    return this.isBizDevCaseStudyAsset(doc) && doc.get('app_global:asset_request') === true;
  }

  canDownloadCreativeAsset(doc: DocumentModel): Observable<boolean> {
    return combineLatest(
      doc.hasPermission(NuxeoPermission.ReadWrite),
      doc.hasPermission(NuxeoPermission.Everything),
      this.userService.getCurrentUserInfo().pipe(
        concatMap((user: UserModel) => doc.getParentPropertyByOperation('app_global:download_mainfile').pipe(
          map((permission: boolean) => user.canAccess() && permission === true),
        )),
      ), (one, two, three) => {
        return one || two || three;
      }).pipe(
        share(),
      );
  }

  goBack(): void {
    this.queryParamsService.historyBack();
  }

}
