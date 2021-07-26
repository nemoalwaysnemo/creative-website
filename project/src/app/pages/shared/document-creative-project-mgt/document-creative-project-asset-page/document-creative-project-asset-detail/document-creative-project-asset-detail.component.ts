import { Component, ComponentFactoryResolver } from '@angular/core';
import { DocumentModel, NuxeoPermission, UserModel } from '@core/api';
import { DocumentCreativeProjectMgtBaseComponent } from '../../document-creative-project-mgt-base.component';
import { GlobalDocumentDialogService } from '../../../global-document-dialog/global-document-dialog.service';
import { CreativeProjectMgtSettings } from '../../document-creative-project-mgt.interface';
import { DocumentFormStatus } from '../../../document-form/document-form.interface';
import { DocumentPageService } from '../../../services/document-page.service';
import { of as observableOf, Observable, combineLatest } from 'rxjs';
import { concatMap, map, share } from 'rxjs/operators';

@Component({
  selector: 'document-creative-project-asset-detail',
  styleUrls: ['../../document-creative-project-mgt.component.scss', '../document-creative-project-asset-page.component.scss'],
  templateUrl: './document-creative-project-asset-detail.component.html',
})
export class DocumentCreativeProjectAssetDetailComponent extends DocumentCreativeProjectMgtBaseComponent {

  shareUrl: string = this.documentPageService.getCurrentFullUrl();

  enableThumbnailCreation: boolean = true;

  writePermission$: Observable<boolean> = observableOf(false);

  deletePermission$: Observable<boolean> = observableOf(false);

  downloadPermission$: Observable<boolean> = observableOf(false);

  viewerSettings: any = {
  };

  constructor(
    protected documentPageService: DocumentPageService,
    protected componentFactoryResolver: ComponentFactoryResolver,
    protected globalDocumentDialogService: GlobalDocumentDialogService,
  ) {
    super(documentPageService, componentFactoryResolver, globalDocumentDialogService);
  }

  protected onInit(): void {
    this.shareUrl = this.buildShareUrl(this.document);
  }

  buildShareUrl(doc: DocumentModel): string {
    return this.documentPageService.getCurrentAppUrl('creative/asset/' + doc.uid);
  }

  goHome(): void {
    this.triggerChangeView('asset-home-view', 'view', new CreativeProjectMgtSettings({ document: this.templateSettings.project }));
  }

  protected beforeSetDocument(doc: DocumentModel, user: UserModel, formSettings: CreativeProjectMgtSettings): Observable<DocumentModel> {
    this.writePermission$ = doc.hasPermission(NuxeoPermission.Write);
    this.downloadPermission$ = this.canDownloadCreativeAsset(doc);
    this.deletePermission$ = !doc.hasAnyContent ? doc.hasPermission(NuxeoPermission.Delete) : observableOf(false);
    return observableOf(doc);
  }

  changeDialogView(type: string, view = 'view'): void {
    this.triggerChangeView(type, view,
      new CreativeProjectMgtSettings({
        document: this.document,
        dialogDocument: this.document,
        project: this.templateSettings.project,
        homeTemplate: 'creative-project-mgt-template',
        homePage: 'asset-page',
        homeView: 'asset-detail-view',
        formMode: 'edit',
        buttonGroup: [
          {
            label: 'save',
            name: 'mgt-asset-save',
            type: 'custom',
            disabled: (status: DocumentFormStatus) => status.submitted || !status.formValid,
            triggerSave: true,
          },
          {
            label: 'cancel',
            name: 'mgt-asset-cancel',
            type: 'custom',
          },
        ],
      }));
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
