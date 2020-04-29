import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { SearchQueryParamsService, GlobalDocumentDialogService } from '@pages/shared';
import { DocumentModel, NuxeoPermission } from '@core/api';
import { Observable, of as observableOf } from 'rxjs';
import { NUXEO_PATH_INFO, NUXEO_META_INFO } from '@environment/environment';
import { Router } from '@angular/router';
import { GLOBAL_DOCUMENT_FORM } from '@pages/shared/global-document-form';
import { getDocumentTypes } from '@core/services/helpers';

@Component({
  selector: 'biz-dev-folder-view',
  styleUrls: ['../../../theme/styles/document-folder-view.scss'],
  templateUrl: './biz-dev-folder-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BizDevFolderViewComponent {

  @Input() loading: boolean;

  @Input() deleteRedirect: string = '';

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
      }
    }
  }

  writePermission$: Observable<boolean> = observableOf(false);
  deletePermission$: Observable<boolean> = observableOf(false);

  dialogMetadata: any = {
    formMode: 'edit',
    enableEdit: false,
    enableDeletion: false,
  };

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected queryParamsService: SearchQueryParamsService,
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

  getDocumentFormComponent(doc: DocumentModel): any {
    if (doc.type === 'App-BizDev-CaseStudy-Folder') {
      return GLOBAL_DOCUMENT_FORM.BIZ_DEV_CASE_STUDY_FOLDER_FORM;
    } else if (doc.type === 'App-BizDev-Thought-Folder') {
      return GLOBAL_DOCUMENT_FORM.BIZ_DEV_THOUGHT_FOLDER_FORM;
    }
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

  openDialog(dialog: any): void {
    this.globalDocumentDialogService.open(dialog);
  }

  goBack(): void {
    const parentInfo: any = this.goBackInfo(this.doc.type);
    if ((NUXEO_META_INFO.BIZ_DEV_SUB_FOLDER_TYPES).includes(this.doc.type)) {
      this.router.navigate(['p/redirect'], { queryParams: { url: `${parentInfo.urlRootPath}` } });
    } else {
      const rootPath: string = parentInfo.rootPath;
      const splitPath: string = this.doc.path.split(rootPath)[1];
      const childSplitPath: string[] = splitPath.split('/');

      if (childSplitPath.length < 2) {
        if (this.router.url.includes('/asset/')) {
          this.router.navigate(['p/redirect'], { queryParams: { url: `${parentInfo.urlParentPath}${this.doc.uid}` } });
        } else {
          this.router.navigate(['p/redirect'], { queryParams: { url: `${parentInfo.urlRootPath}` } });
        }
      } else {
        this.router.navigate(['p/redirect'], { queryParams: { url: `${parentInfo.urlParentPath}${this.doc.uid}` } });
      }
    }
  }

  toImageParentDocument(): any {
    if ((NUXEO_META_INFO.BIZ_DEV_SUB_FOLDER_TYPES).includes(this.doc.type)) {
      return [this.getAssetUrl(this.doc)];
    } else {
      return [this.getAssetUrl(this.doc), this.doc.uid];
    }
  }
  protected goBackInfo(type: string): any {
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
