import { Component, Input, TemplateRef, Type } from '@angular/core';
import { DocumentModel, NuxeoPermission } from '@core/api';
import { Observable, of as observableOf } from 'rxjs';
import { getDocumentTypes } from '@core/services/helpers';
import { GlobalDocumentDialogService, DocumentPageService, DocumentModelForm } from '../../shared';
import { GLOBAL_DOCUMENT_FORM } from '../../shared/global-document-form';
import { GLOBAL_DOCUMENT_DIALOG, GlobalDocumentDialogSettings } from '../../shared/global-document-dialog';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'backslash-folder-view',
  styleUrls: ['../../../theme/styles/document-folder-view.scss'],
  templateUrl: './backslash-folder-view.component.html',
})
export class BackslashFolderViewComponent {

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
    return this.assetUrl ? this.assetUrl : this.matchAssetUrl(doc);
  }

  private matchAssetUrl(doc: DocumentModel): string {
    return this.assetUrlMapping[doc.type] ? this.assetUrlMapping[doc.type] : this.assetUrlMapping['*'];
  }

  isParentFolder(doc: DocumentModel): boolean {
    return doc && getDocumentTypes(NUXEO_DOC_TYPE.BACKSLASH_SUB_FOLDER_TYPE).includes(doc.type);
  }

  getDialogFormSettings(doc: DocumentModel): GlobalDocumentDialogSettings {
    const components: Type<DocumentModelForm>[] = [];
    if (doc.type === 'App-Backslash-Resources-Assetfolder') {
      components.push(GLOBAL_DOCUMENT_FORM.BACKSLASH_EDGES_FOLDER_FORM);
    }
    return new GlobalDocumentDialogSettings({ components });
  }

  getFormTitle(doc: DocumentModel): any {
    let formTitle;
    switch (doc.type) {
      case 'App-Backslash-Resources-Assetfolder':
        formTitle = 'Edit Edges Folder';
        break;
      default:
        break;
    }
    return formTitle;
  }

  openDialog(dialog: TemplateRef<any>): void {
    this.globalDocumentDialogService.open(dialog);
  }

  goBack(): void {
    const parentInfo: any = this.goBackInfo(this.doc.type);
    if ((NUXEO_DOC_TYPE.BACKSLASH_SUB_FOLDER_TYPE).includes(this.doc.type)) {
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
    if ((NUXEO_DOC_TYPE.BACKSLASH_SUB_FOLDER_TYPE).includes(this.doc.type)) {
      return [this.getAssetUrl(this.doc)];
    } else {
      return [this.getAssetUrl(this.doc), this.doc.uid];
    }
  }

  private goBackInfo(type: string): any {
    switch (type) {
      case 'App-Backslash-Resources-Assetfolder':
        return {
          'rootPath': NUXEO_PATH_INFO.BACKSLASH_EDGE_FOLDER_PATH,
          'urlRootPath': '/p/backslash/edge/',
          'urlParentPath': '/p/backslash/edge/folder/',
        };
      case 'App-Backslash-Edges-Folder':
        return {
          'rootPath': NUXEO_PATH_INFO.BACKSLASH_EDGE_FOLDER_PATH,
          'urlRootPath': '/p/backslash/edge/',
          'urlParentPath': '/p/backslash/edge/',
        };
      default:
        return {};
    }
  }

}
