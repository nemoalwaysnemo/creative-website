import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { GlobalDocumentDialogService, SearchQueryParamsService } from '@pages/shared';
import { DocumentModel, NuxeoPermission } from '@core/api';
import { Observable, of as observableOf } from 'rxjs';
import { Router } from '@angular/router';
import { NUXEO_PATH_INFO, NUXEO_META_INFO } from '@environment/environment';
import { getDocumentTypes } from '@core/services/helpers';
import { GLOBAL_DOCUMENT_FORM } from '@pages/shared/global-document-form';

@Component({
  selector: 'biz-dev-folder-view',
  styleUrls: ['../../../theme/styles/document-folder-view.scss'],
  templateUrl: './biz-dev-folder-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BizDevFolderViewComponent {

  @Input() loading: boolean;
  showEdit: string = 'edit';
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

  openDialog(dialog: any, type): void {
    this.showEdit = type;
    this.globalDocumentDialogService.open(dialog);
  }

  getDocumentFormComponent(doc: DocumentModel): any {
    if (doc.type === 'App-BizDev-CaseStudy-Folder') {
      return GLOBAL_DOCUMENT_FORM.BIZ_DEV_CASE_STUDY_FOLDER_FORM;
    } else if (doc.type === 'App-BizDev-Thought-Folder') {
      return GLOBAL_DOCUMENT_FORM.BIZ_DEV_THOUGHT_FOLDER_FORM;
    }  else if (doc.type === 'App-BizDev-Case-Studies-Folder') {
      return GLOBAL_DOCUMENT_FORM.BIZ_DEV_CASE_STUDY_FOLDER_FORM;
    }  else if (doc.type === 'App-BizDev-ThoughtLeadership-Folder') {
      return GLOBAL_DOCUMENT_FORM.BIZ_DEV_THOUGHT_FOLDER_FORM;
    }
  }

  onUpdate(doc: DocumentModel): void {
    this.router.navigate(['/p/redirect'], { queryParams: { url: decodeURI(this.router.url) } });
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
      return [this.getAssetUrl(this.doc),  this.doc.uid];
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
