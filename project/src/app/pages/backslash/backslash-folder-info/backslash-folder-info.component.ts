import { Component, Input, TemplateRef, Type } from '@angular/core';
import { DocumentModel, NuxeoPermission } from '@core/api';
import { Observable, of as observableOf } from 'rxjs';
import { getDocumentTypes, matchAssetUrl } from '@core/services/helpers';
import { GlobalDocumentDialogService, DocumentPageService, DocumentModelForm } from '../../shared';
import { GLOBAL_DOCUMENT_FORM } from '../../shared/global-document-form';
import { GLOBAL_DOCUMENT_DIALOG, GlobalDocumentDialogSettings } from '../../shared/global-document-dialog';
import { NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'backslash-folder-info',
  styleUrls: ['../../../theme/styles/document-folder-view.scss'],
  templateUrl: './backslash-folder-info.component.html',
})
export class BackslashFolderInfoComponent {

  @Input() loading: boolean;

  @Input() deleteRedirectUrl: string = '';

  @Input() assetUrl: string;

  @Input() backAssetFlag: boolean = false;

  @Input() assetUrlMapping: any = {};

  @Input() doc: DocumentModel;

  @Input() showButton: boolean = true;

  @Input() showFolderInfo: boolean = true;

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
    return doc && (getDocumentTypes(NUXEO_DOC_TYPE.BACKSLASH_RESOURCES_BASE_FOLDER_TYPE).includes(doc.type));
  }

  getDialogFormSettings(doc: DocumentModel): GlobalDocumentDialogSettings {
    const components: Type<DocumentModelForm>[] = [];
    if (doc.type === 'App-Backslash-Resources-Assetfolder') {
      components.push(GLOBAL_DOCUMENT_FORM.BACKSLASH_RESOURCES_FOLDER_FORM);
    } else if (doc.type === 'App-Backslash-Case-Study-Folder') {
      components.push(GLOBAL_DOCUMENT_FORM.BACKSLASH_CASE_STUDY_FOLDER_FORM);
    } else if (doc.type === 'App-Backslash-Edges-Assetfolder') {
      components.push(GLOBAL_DOCUMENT_FORM.BACKSLASH_EDGES_FOLDER_FORM);
    }
    return new GlobalDocumentDialogSettings({ components });
  }

  getFormTitle(doc: DocumentModel): any {
    let formTitle;
    switch (doc.type) {
      case 'App-Backslash-Resources-Assetfolder':
        formTitle = 'Edit Resource Folder';
        break;
      case 'App-Backslash-Case-Study-Folder':
        formTitle = 'Edit Case Study Folder';
        break;
      case 'App-Backslash-Edges-Assetfolder':
        formTitle = 'Edit Edges Folder';
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
          rootPath: this.documentPageService.getConfig('path:BACKSLASH_RESOURCES_FOLDER_PATH'),
          urlRootPath: '/p/backslash/resource/',
          urlParentPath: '/p/backslash/resource/folder/',
        };
      case 'App-Backslash-Resources-Folder':
        return {
          rootPath: this.documentPageService.getConfig('path:BACKSLASH_RESOURCES_FOLDER_PATH'),
          urlRootPath: '/p/backslash/resource/',
          urlParentPath: '/p/backslash/resource/',
        };
      case 'App-Backslash-Case-Study-Folder':
        return {
          rootPath: this.documentPageService.getConfig('path:BACKSLASH_CASE_STUDIES_FOLDER_PATH'),
          urlRootPath: '/p/backslash/report/',
          urlParentPath: '/p/backslash/report/folder/',
        };
      case 'App-Backslash-Case-Study-Category':
        return {
          rootPath: this.documentPageService.getConfig('path:BACKSLASH_CASE_STUDIES_FOLDER_PATH'),
          urlRootPath: '/p/backslash/category/',
          urlParentPath: '/p/backslash/report/folder/',
        };
      case 'App-Backslash-Case-Study-Region':
        return {
          rootPath: this.documentPageService.getConfig('path:BACKSLASH_CASE_STUDIES_FOLDER_PATH'),
          urlRootPath: '/p/backslash/region/',
          urlParentPath: '/p/backslash/report/folder/',
        };
      case 'App-Backslash-Case-Studies-Folder':
        return {
          rootPath: this.documentPageService.getConfig('path:BACKSLASH_CASE_STUDIES_FOLDER_PATH'),
          urlRootPath: '/p/backslash/report/',
          urlParentPath: '/p/backslash/report/folder/',
        };
      case 'App-Backslash-Edges-Folder':
        return {
          rootPath: this.documentPageService.getConfig('path:BACKSLASH_EDGE_FOLDER_PATH'),
          urlRootPath: '/p/backslash/edge/',
          urlParentPath: '/p/backslash/edge/',
        };
      case 'App-Backslash-Edges-Assetfolder':
        return {
          rootPath: this.documentPageService.getConfig('path:BACKSLASH_EDGE_FOLDER_PATH'),
          urlRootPath: '/p/backslash/edge/',
          urlParentPath: '/p/backslash/edge/folder/',
        };
      default:
        return {};
    }
  }

  getAssetPath(doc: DocumentModel): string {
    return doc.facets.includes('Thumbnail') && doc.contextParameters && doc.contextParameters.thumbnail ? doc.contextParameters.thumbnail.url : '/assets/images/App-Intelligence-Brands-Icon.jpg';
  }
}
