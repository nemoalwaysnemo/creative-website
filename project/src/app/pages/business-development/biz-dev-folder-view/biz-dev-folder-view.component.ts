import { Component, Input, TemplateRef, Type } from '@angular/core';
import { DocumentModel, NuxeoPermission } from '@core/api';
import { Observable, of as observableOf } from 'rxjs';
import { getDocumentTypes, matchAssetUrl } from '@core/services/helpers';
import { GlobalDocumentDialogService, DocumentPageService, DocumentModelForm } from '../../shared';
import { GLOBAL_DOCUMENT_FORM } from '../../shared/global-document-form';
import { GLOBAL_DOCUMENT_DIALOG, GlobalDocumentDialogSettings } from '../../shared/global-document-dialog';
import { NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'biz-dev-folder-view',
  styleUrls: ['../../../theme/styles/document-folder-view.scss'],
  templateUrl: './biz-dev-folder-view.component.html',
})
export class BizDevFolderViewComponent {

  @Input() loading: boolean;

  @Input() deleteRedirectUrl: string = '';

  @Input() assetUrl: string;

  @Input() backAssetFlag: boolean = false;

  @Input() assetUrlMapping: any = {};

  @Input() doc: DocumentModel;

  @Input() showButton: boolean = true;

  @Input()
  set document(doc: DocumentModel) {
    if (doc) {
      this.doc = doc;
      if (this.showButton) {
        this.writePermission$ = doc.hasPermission(NuxeoPermission.Write);
        this.deletePermission$ = !doc.hasAnyContent ? doc.hasPermission(NuxeoPermission.Delete) : observableOf(false);
        this.editRedirectUrl = this.getAssetUrl(doc) + doc.uid;
      }
    }
  }

  deletTitle: string = 'Delete';

  editRedirectUrl: string = this.documentPageService.getCurrentUrl();

  writePermission$: Observable<boolean> = observableOf(false);

  deletePermission$: Observable<boolean> = observableOf(false);

  deleteDialogSettings: GlobalDocumentDialogSettings = new GlobalDocumentDialogSettings({ components: [GLOBAL_DOCUMENT_DIALOG.CUSTOM_DELETION] });

  dialogMetadata: any = {
    formMode: 'edit',
    enableEdit: false,
    enableDeletion: false,
  };

  constructor(
    private documentPageService: DocumentPageService,
    private globalDocumentDialogService: GlobalDocumentDialogService,
  ) { }

  getAssetUrl(doc: DocumentModel): string {
    return this.assetUrl ? this.assetUrl : matchAssetUrl(doc, this.assetUrlMapping);
  }

  isParentFolder(doc: DocumentModel): boolean {
    return doc && (getDocumentTypes(NUXEO_DOC_TYPE.BIZ_DEV_CASE_STUDIES_BASE_FOLDER_TYPE).includes(doc.type) || getDocumentTypes(NUXEO_DOC_TYPE.BIZ_DEV_THOUGHT_LEADERSHIP_BASE_FOLDER_TYPE).includes(doc.type));
  }

  getDialogFormSettings(doc: DocumentModel): GlobalDocumentDialogSettings {
    const components: Type<DocumentModelForm>[] = [];
    if (doc.type === 'App-BizDev-CaseStudy-Folder') {
      components.push(GLOBAL_DOCUMENT_FORM.BIZ_DEV_CASE_STUDY_FOLDER_FORM);
    } else if (doc.type === 'App-BizDev-Thought-Folder') {
      components.push(GLOBAL_DOCUMENT_FORM.BIZ_DEV_THOUGHT_FOLDER_FORM);
    }
    return new GlobalDocumentDialogSettings({ components });
  }

  getFormTitle(doc: DocumentModel): any {
    let formTitle;
    switch (doc.type) {
      case 'App-BizDev-CaseStudy-Folder':
        formTitle = 'Edit Case Folder';
        break;
      case 'App-BizDev-Thought-Folder':
        formTitle = 'Edit Thought Folder';
        break;
      default:
        break;
    }
    return formTitle;
  }

  openDialog(dialog: TemplateRef<any>, closeOnBackdropClick: boolean = true): void {
    this.globalDocumentDialogService.open(dialog, { closeOnBackdropClick });
  }

  goBack(): void {
    const parentInfo: any = this.goBackInfo(this.doc.type);
    if ((NUXEO_DOC_TYPE.BIZ_DEV_SUB_FOLDER_TYPES).includes(this.doc.type)) {
      this.documentPageService.redirect(parentInfo.urlRootPath);
    } else {
      const rootPath: string = parentInfo.rootPath;
      const splitPath: string = this.doc.path.split(rootPath)[1];
      const childSplitPath: string[] = splitPath.split('/');

      if (this.documentPageService.getCurrentUrl().includes('/asset/')) {
        this.documentPageService.redirect(`${parentInfo.urlParentPath}${this.doc.uid}`);
      } else if (childSplitPath.length < 2) {
        this.documentPageService.redirect(`${parentInfo.urlRootPath}`);
      } else {
        this.documentPageService.redirect(`${parentInfo.urlParentPath}${this.doc.parentRef}`);
      }
    }
  }

  toImageParentDocument(): any {
    if ((NUXEO_DOC_TYPE.BIZ_DEV_SUB_FOLDER_TYPES).includes(this.doc.type)) {
      return [this.getAssetUrl(this.doc)];
    } else {
      return [this.getAssetUrl(this.doc), this.doc.uid];
    }
  }

  private goBackInfo(type: string): any {
    switch (type) {
      case 'App-BizDev-Thought-Folder':
        return {
          rootPath: this.documentPageService.getConfig('path:BIZ_DEV_THOUGHT_LEADERSHIP_FOLDER_PATH'),
          urlRootPath: '/p/business-development/Thought Leadership/',
          urlParentPath: '/p/business-development/Thought Leadership/folder/',
        };
      case 'App-BizDev-CaseStudy-Folder':
        return {
          rootPath: this.documentPageService.getConfig('path:BIZ_DEV_CASE_STUDIES_FOLDER_PATH'),
          urlRootPath: '/p/business-development/Case Studies/',
          urlParentPath: '/p/business-development/Case Studies/folder/',
        };
      case 'App-BizDev-ThoughtLeadership-Folder':
        return {
          rootPath: this.documentPageService.getConfig('path:BIZ_DEV_THOUGHT_LEADERSHIP_FOLDER_PATH'),
          urlRootPath: '/p/business-development/Thought Leadership/',
          urlParentPath: '/p/business-development/Thought Leadership/',
        };
      case 'App-BizDev-Case-Studies-Folder':
        return {
          rootPath: this.documentPageService.getConfig('path:BIZ_DEV_THOUGHT_LEADERSHIP_FOLDER_PATH'),
          urlRootPath: '/p/business-development/Case Studies/',
          urlParentPath: '/p/business-development/Case Studies/',
        };
      default:
        return {};
    }
  }

}
