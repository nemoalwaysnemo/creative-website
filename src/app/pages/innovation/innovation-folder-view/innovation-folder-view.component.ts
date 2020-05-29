import { Component, Input, TemplateRef, Type } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentModel, NuxeoPermission } from '@core/api';
import { getDocumentTypes } from '@core/services/helpers';
import { Observable, of as observableOf } from 'rxjs';
import { GlobalDocumentDialogService, SearchQueryParamsService, DocumentModelForm } from '../../shared';
import { GLOBAL_DOCUMENT_FORM } from '../../shared/global-document-form';
import { GLOBAL_DOCUMENT_DIALOG } from '../../shared/global-document-dialog';
import { NUXEO_PATH_INFO, NUXEO_META_INFO } from '@environment/environment';
import { GlobalDocumentDialogSettings } from '../../shared/global-document-dialog/global-document-dialog.interface';

@Component({
  selector: 'innovation-folder-view',
  styleUrls: ['../../../theme/styles/document-folder-view.scss'],
  templateUrl: './innovation-folder-view.component.html',
})
export class InnovationFolderViewComponent {

  @Input() loading: boolean;

  @Input() deleteRedirectUrl: string = '';

  @Input() assetUrl: string;

  @Input() backAssetFlag: boolean = false;

  @Input() assetUrlMapping: object = {};

  @Input() doc: DocumentModel;

  @Input() showButton: boolean = true;

  @Input() set document(doc: DocumentModel) {
    if (doc) {
      this.doc = doc;
      if (this.showButton) {
        this.writePermission$ = doc.hasPermission(NuxeoPermission.Write);
        this.deletePermission$ = !doc.hasAnyContent ? this.doc.hasPermission(NuxeoPermission.Delete) : observableOf(false);
        this.editRedirectUrl = this.getAssetUrl(this.doc) + doc.uid;
      }
    }
  }

  deletTitle: string = 'Delete';

  editTitle: string = 'Edit Folder';

  editRedirectUrl: string = this.router.url;

  writePermission$: Observable<boolean> = observableOf(false);

  deletePermission$: Observable<boolean> = observableOf(false);

  dialogSettings: GlobalDocumentDialogSettings = new GlobalDocumentDialogSettings({ components: [GLOBAL_DOCUMENT_FORM.INNOVATION_FOLDER_FORM] });

  deleteDialogSettings: GlobalDocumentDialogSettings = new GlobalDocumentDialogSettings({ components: [GLOBAL_DOCUMENT_DIALOG.CUSTOM_DELETION] });

  dialogMetadata: any = {
    formMode: 'edit',
    enableEdit: false,
    enableDeletion: false,
  };

  constructor(
    private globalDocumentDialogService: GlobalDocumentDialogService,
    private queryParamsService: SearchQueryParamsService,
    private router: Router,
  ) { }

  getAssetUrl(doc: DocumentModel): string {
    return this.assetUrl ? this.assetUrl : this.matchAssetUrl(doc);
  }

  private matchAssetUrl(doc: DocumentModel): string {
    let url = '';
    if (this.assetUrlMapping[doc.type] instanceof Function) {
      url = this.assetUrlMapping[doc.type].call(this, doc);
    } else {
      url = this.assetUrlMapping[doc.type] ? this.assetUrlMapping[doc.type] : this.assetUrlMapping['*'];
    }
    return url;
  }

  isParentFolder(doc: DocumentModel): boolean {
    return doc && (getDocumentTypes(NUXEO_META_INFO.BIZ_DEV_CASE_STUDIES_BASE_FOLDER_TYPE).includes(doc.type) || getDocumentTypes(NUXEO_META_INFO.BIZ_DEV_THOUGHT_LEADERSHIP_BASE_FOLDER_TYPE).includes(doc.type));
  }

  openDialog(dialog: TemplateRef<any>): void {
    this.globalDocumentDialogService.open(dialog);
  }

  inBaseFolder(): boolean {
    return this.doc.path.search(/\/NEXT$|\/Things to Steal$/) !== -1;
  }

  goBack(): void {
    const url = this.router.url;
    const assetReg = /asset\/[0-9,a-z]{8}(-[0-9,a-z]{4}){3}-[0-9,a-z]{12}$/;
    if (url.search(assetReg) === -1 || this.inBaseFolder()) {
      this.queryParamsService.redirect(url.split('/folder')[0]);
    } else {
      this.queryParamsService.redirect(url.split('/asset')[0]);
    }
  }

  toImageParentDocument(): any {
    this.goBack();
  }

  private goBackInfo(url: string): any {
    url = decodeURI(url);
    if (url.includes('/NEXT')) {
      return {
        'rootPath': NUXEO_PATH_INFO.INNOVATION_NEXT_FOLDER_PATH,
        'urlRootPath': '/p/innovation/NEXT/',
        'urlParentPath': '/p/innovation/NEXT/folder/',
      };
    } else if (url.includes('/Things to Steal')) {
      return {
        'rootPath': NUXEO_PATH_INFO.INNOVATION_THINGS_TO_STEAL_FOLDER_PATH,
        'urlRootPath': '/p/innovation/Things to steal/',
        'urlParentPath': '/p/innovation/Things to steal/folder/',
      };
    }
  }

}
