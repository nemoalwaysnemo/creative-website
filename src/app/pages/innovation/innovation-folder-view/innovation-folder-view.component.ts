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
        this.editRedirectUrl = this.getAssetUrl(this.doc) + this.doc.uid;
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
    return this.assetUrlMapping[doc.type] ? this.assetUrlMapping[doc.type] : this.assetUrlMapping['*'];
  }

  isParentFolder(doc: DocumentModel): boolean {
    return doc && (getDocumentTypes(NUXEO_META_INFO.BIZ_DEV_CASE_STUDIES_BASE_FOLDER_TYPE).includes(doc.type) || getDocumentTypes(NUXEO_META_INFO.BIZ_DEV_THOUGHT_LEADERSHIP_BASE_FOLDER_TYPE).includes(doc.type));
  }

  openDialog(dialog: TemplateRef<any>): void {
    this.globalDocumentDialogService.open(dialog);
  }

  goBack(): void {
    const parentInfo: any = this.goBackInfo(this.getAssetUrl(this.doc));
    const rootPath: string = parentInfo.rootPath;
    const splitPath: string = this.doc.path.split(rootPath)[1];
    const childSplitPath: string[] = splitPath.split('/');

    if (childSplitPath.length < 2) {
      this.queryParamsService.redirect(`${parentInfo.urlRootPath}`);
    } else {
      this.queryParamsService.redirect(`${parentInfo.urlParentPath}${this.doc.parentRef}`);
    }
  }

  toImageParentDocument(): any {
    if ((NUXEO_META_INFO.INNOVATION_FOLDER_TYPE).includes(this.doc.type)) {
      return [this.getAssetUrl(this.doc)];
    } else {
      return [this.getAssetUrl(this.doc), this.doc.uid];
    }
  }

  private goBackInfo(type: string): any {
    // if () {

    // }


    switch (type) {
      case 'App-BizDev-Thought-Folder':
        return {
          'rootPath': NUXEO_PATH_INFO.BIZ_DEV_THOUGHT_LEADERSHIP_FOLDER_PATH,
          'urlRootPath': '/p/business-development/Thought Leadership/',
          'urlParentPath': '/p/business-development/Thought Leadership/folder/',
        };
      case 'App-BizDev-CaseStudy-Folder':
        return {
          'rootPath': NUXEO_PATH_INFO.BIZ_DEV_CASE_STUDIES_FOLDER_PATH,
          'urlRootPath': '/p/business-development/Case Studies/',
          'urlParentPath': '/p/business-development/Case Studies/folder/',
        };
      case 'App-BizDev-ThoughtLeadership-Folder':
        return {
          'rootPath': NUXEO_PATH_INFO.BIZ_DEV_THOUGHT_LEADERSHIP_FOLDER_PATH,
          'urlRootPath': '/p/business-development/Thought Leadership/',
          'urlParentPath': '/p/business-development/Thought Leadership/',
        };
      case 'App-BizDev-Case-Studies-Folder':
        return {
          'rootPath': NUXEO_PATH_INFO.BIZ_DEV_THOUGHT_LEADERSHIP_FOLDER_PATH,
          'urlRootPath': '/p/business-development/Case Studies/',
          'urlParentPath': '/p/business-development/Case Studies/',
        };
      default:
        return {};
    }
  }

}
