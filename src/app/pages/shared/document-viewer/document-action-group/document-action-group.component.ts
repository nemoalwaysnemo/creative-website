import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Location } from '@angular/common';
import { Observable, of as observableOf, combineLatest } from 'rxjs';
import { concatMap, map, share, tap } from 'rxjs/operators';
import { DocumentModel, UserService, UserModel, NuxeoUserGroups, NuxeoPermission } from '@core/api';
import { getDocumentTypes } from '@core/services';
import { NUXEO_META_INFO } from '@environment/environment';

@Component({
  selector: 'document-action-group',
  styleUrls: ['./document-action-group.component.scss'],
  templateUrl: './document-action-group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentActionGroupComponent {

  documentModel: DocumentModel;

  downloadPermission$: Observable<boolean> = observableOf(false);

  @Input() styleName: string;

  @Input()
  set document(doc: DocumentModel) {
    if (doc) {
      this.documentModel = doc;
      if (this.isCreativeAsset(doc)) {
        this.downloadPermission$ = this.canDownloadCreativeAsset(doc);
      } else {
        this.downloadPermission$ = observableOf(true);
      }
    }
  }

  constructor(
    private userService: UserService,
    private location: Location,
  ) { }

  isCreativeAsset(doc: DocumentModel): boolean {
    return doc && getDocumentTypes(NUXEO_META_INFO.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES).includes(doc.type);
  }

  canDownloadCreativeAsset(doc: DocumentModel): Observable<boolean> {
    return combineLatest(
      doc.hasPermission(NuxeoPermission.ReadWrite),
      doc.hasPermission(NuxeoPermission.Everything),
      this.userService.getCurrentUserInfo().pipe(
        concatMap((user: UserModel) => doc.getParentProperty('app_global:download_mainfile').pipe(
          map((permission: boolean) => user.hasGroup(NuxeoUserGroups.Everyone) && permission === true),
        )),
      ), (one, two, three) => {
        return one || two || three;
      }).pipe(
        share(),
      );
  }

  goBack() {
    this.location.back();
  }

}
