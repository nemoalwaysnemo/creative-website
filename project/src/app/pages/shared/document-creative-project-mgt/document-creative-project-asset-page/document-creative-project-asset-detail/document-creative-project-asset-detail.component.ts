import { Component, ComponentFactoryResolver } from '@angular/core';
import { NbMenuItem } from '@core/nebular/theme';
import { DocumentModel, NuxeoPermission, UserModel } from '@core/api';
import { DocumentCreativeProjectMgtBaseComponent } from '../../document-creative-project-mgt-base.component';
import { CreativeProjectMgtSettings } from '../../document-creative-project-mgt.interface';
import { DocumentPageService, GlobalEvent } from '../../../services/document-page.service';
import { of as observableOf, Observable, combineLatest } from 'rxjs';
import { concatMap, map, share } from 'rxjs/operators';

@Component({
  selector: 'document-creative-project-asset-detail',
  styleUrls: ['../../document-creative-project-mgt.component.scss', '../document-creative-project-asset-page.component.scss'],
  templateUrl: './document-creative-project-asset-detail.component.html',
})
export class DocumentCreativeProjectAssetDetailComponent extends DocumentCreativeProjectMgtBaseComponent {

  shareUrl: string = '';

  enableThumbnailCreation: boolean = true;

  writePermission$: Observable<boolean> = observableOf(false);

  deletePermission$: Observable<boolean> = observableOf(false);

  downloadPermission$: Observable<boolean> = observableOf(false);

  viewerSettings: any = {
  };

  actions: NbMenuItem[] = [
    {
      id: 'edit',
      title: 'Edit',
    },
    {
      id: 'download',
      title: 'Download',
    },
    {
      id: 'share',
      title: 'Share',
    },
    {
      id: 'new-poster',
      title: ' New Poster',
    },
  ];

  constructor(
    protected documentPageService: DocumentPageService,
    protected componentFactoryResolver: ComponentFactoryResolver,
  ) {
    super(documentPageService, componentFactoryResolver);

  }

  onMenuClick(item: NbMenuItem): void {

  }

  protected beforeSetDocument(doc: DocumentModel, user: UserModel, formSettings: CreativeProjectMgtSettings): Observable<DocumentModel> {
    this.writePermission$ = doc.hasPermission(NuxeoPermission.Write);
    this.downloadPermission$ = this.canDownloadCreativeAsset(doc);
    this.deletePermission$ = !doc.hasAnyContent ? doc.hasPermission(NuxeoPermission.Delete) : observableOf(false);
    return observableOf(doc);
  }


  changeDialogView(type: string): void {

  }

  googleAnalyticsTrackLink(doc: DocumentModel, category: string, type: string = ''): void {
    this.documentPageService.googleAnalyticsTrackLink(doc, category, type);
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
}
