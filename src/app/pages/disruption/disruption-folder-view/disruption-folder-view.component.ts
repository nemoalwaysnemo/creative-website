import { Component, Input, ChangeDetectionStrategy, TemplateRef } from '@angular/core';
import { GlobalDocumentDialogService } from '@pages/shared';
import { DocumentModel, NuxeoPermission } from '@core/api';
import { Observable, of as observableOf } from 'rxjs';
import { Router } from '@angular/router';
import { NUXEO_PATH_INFO, NUXEO_META_INFO } from '@environment/environment';
import { getDocumentTypes } from '@core/services/helpers';
import { GLOBAL_DOCUMENT_FORM } from '@pages/shared/global-document-form';
import { GLOBAL_DOCUMENT_DIALOG } from '@pages/shared/global-document-dialog';

@Component({
  selector: 'disruption-folder-view',
  styleUrls: ['../../../theme/styles/document-folder-view.scss'],
  templateUrl: './disruption-folder-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisruptionFolderViewComponent {

  @Input() loading: boolean;

  @Input() deleteRedirectUrl: string = '';

  @Input() assetUrl: string;

  @Input() backAssetFlag: boolean = false;

  @Input() assetUrlMapping: object = {};

  @Input() showButton: boolean = true;

  @Input() set document(doc: DocumentModel) {
    if (doc) {
      this.doc = doc;
      if (this.showButton) {
        this.writePermission$ = doc.hasPermission(NuxeoPermission.Write);
        this.deletePermission$ = !doc.hasAnyContent ? this.doc.hasPermission(NuxeoPermission.Delete) : observableOf(false);
        this.editRedirectUrl = this.getAssetUrl(this.doc) + this.doc.uid;
      }
    }
  }

  doc: DocumentModel;

  editRedirectUrl: string = this.router.url;

  deletTitle: string = 'Delete';

  generalComponent = GLOBAL_DOCUMENT_DIALOG.GENERAL_DELETION;

  writePermission$: Observable<boolean> = observableOf(false);

  deletePermission$: Observable<boolean> = observableOf(false);

  dialogMetadata: any = {
    formMode: 'edit',
    enableEdit: false,
    enableDeletion: false,
  };

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    private router: Router,
  ) { }

  isDisruptionAsset(doc: DocumentModel): boolean {
    return doc && getDocumentTypes(NUXEO_META_INFO.DISRUPTION_ASSET_TYPE).includes(doc.type);
  }

  getDocumentFormComponent(doc: DocumentModel): any {
    if (doc.type === 'App-Disruption-Day') {
      return GLOBAL_DOCUMENT_FORM.DISRUPTION_DAY_FORM;
    } else if (doc.type === 'App-Disruption-Theory-Folder') {
      return GLOBAL_DOCUMENT_FORM.DISRUPTION_HOW_TOS_ASSET_FORM;
    }
  }

  getFormTitle(doc: DocumentModel): any {
    let formTitle;
    switch (doc.type) {
      case 'App-Disruption-Day':
        formTitle = 'Edit Day';
        break;
      case 'App-Disruption-Theory-Folder':
        formTitle = 'Edit How Tos';
        break;
      default:
        break;
    }
    return formTitle;
  }

  getAssetUrl(doc: DocumentModel): string {
    return this.assetUrl ? this.assetUrl : this.matchAssetUrl(doc);
  }

  private matchAssetUrl(doc: DocumentModel): string {
    return this.assetUrlMapping[doc.type] ? this.assetUrlMapping[doc.type] : this.assetUrlMapping['*'];
  }

  openDialog(dialog: TemplateRef<any>): void {
    this.globalDocumentDialogService.open(dialog);
  }

  goBack(): void {
    const parentInfo: any = this.goBackInfo(this.doc.type);
    const rootPath: string = parentInfo.rootPath;
    const splitPath: string = this.doc.path.split(rootPath)[1];
    const childSplitPath: string[] = splitPath.split('/');

    if (childSplitPath.length < 2) {
      this.router.navigate(['p/redirect'], { queryParams: { url: `${parentInfo.urlRootPath}` } });
    } else {
      this.router.navigate(['p/redirect'], { queryParams: { url: `${parentInfo.urlParentPath}${this.doc.parentRef}` } });
    }
  }

  protected goBackInfo(type: string): any {
    switch (type) {
      case 'App-Disruption-Theory-Folder':
        return {
          'rootPath': NUXEO_PATH_INFO.DISRUPTION_THEORY_PATH,
          'urlRootPath': '/p/disruption/Disruption How Tos',
          'urlParentPath': '/p/disruption/Disruption How Tos/folder/',
        };
      case 'App-Disruption-Day':
        return {
          'rootPath': NUXEO_PATH_INFO.DISRUPTION_DAYS_PATH,
          'urlRootPath': '/p/disruption/Disruption Days',
          'urlParentPath': '/p/disruption/Disruption Days/day/',
        };
      default:
        return {};
    }
  }


}
