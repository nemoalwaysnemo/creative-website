import { Component, Input, TemplateRef } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';
import { DocumentModel, NuxeoPermission } from '@core/api';
import { GlobalDocumentDialogService, DocumentPageService } from '../../shared';
import { GLOBAL_DOCUMENT_FORM } from '../../shared/global-document-form';
import { GLOBAL_DOCUMENT_DIALOG, GlobalDocumentDialogSettings } from '../../shared/global-document-dialog';
import { NUXEO_PATH_INFO } from '@environment/environment';
import { matchAssetUrl } from '@core/services/helpers';

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

  @Input() assetUrlMapping: any = {};

  @Input() doc: DocumentModel;

  @Input() showButton: boolean = true;

  @Input() set document(doc: DocumentModel) {
    if (doc) {
      this.doc = doc;
      if (this.showButton) {
        this.writePermission$ = doc.hasPermission(NuxeoPermission.Write);
        this.deletePermission$ = !doc.hasAnyContent ? doc.hasPermission(NuxeoPermission.Delete) : observableOf(false);
        this.editRedirectUrl = this.getAssetUrl(doc) + doc.uid;
      }
    }
  }

  @Input() showFolderInfo: boolean = true;

  deletTitle: string = 'Delete';

  editTitle: string = 'Edit Folder';

  editRedirectUrl: string = this.documentPageService.getCurrentUrl();

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
    private documentPageService: DocumentPageService,
  ) { }

  getAssetUrl(doc: DocumentModel): string {
    return this.assetUrl ? this.assetUrl : matchAssetUrl(doc, this.assetUrlMapping);
  }

  openDialog(dialog: TemplateRef<any>, closeOnBackdropClick: boolean = true): void {
    this.globalDocumentDialogService.open(dialog, { closeOnBackdropClick });
  }

  inBaseFolder(): boolean {
    return this.doc.path.search(/\/NEXT$|\/Things to Steal$/) !== -1;
  }

  isAsset(url: string): boolean {
    return url.search(/asset\/[0-9,a-z]{8}(-[0-9,a-z]{4}){3}-[0-9,a-z]{12}$/) !== -1;
  }

  goBack(): void {
    if (this.inBaseFolder()) {
      this.documentPageService.redirect(this.editRedirectUrl.split('/folder')[0]);
    } else {
      if (!this.isAsset(this.editRedirectUrl)) {
        const rootPath: string = this.getPathInfo();
        const splitPath: string = this.doc.path.split(rootPath)[1];
        const childSplitPath: string[] = splitPath.split('/');
        if (childSplitPath.length < 2) {
          this.documentPageService.redirect(this.editRedirectUrl.split('/folder')[0]);
        } else {
          this.documentPageService.redirect(this.editRedirectUrl.split('/folder')[0] + '/folder/' + this.doc.parentRef);
        }
      } else {
        this.documentPageService.redirect(this.editRedirectUrl.split('/asset')[0]);
      }

    }
  }

  private getPathInfo(): any {
    const url: string = decodeURI(this.editRedirectUrl);
    let path: string;
    if (url.includes('/NEXT')) {
      path = NUXEO_PATH_INFO.INNOVATION_NEXT_FOLDER_PATH;
    } else if (url.includes('/Things to Steal')) {
      path = NUXEO_PATH_INFO.INNOVATION_THINGS_TO_STEAL_FOLDER_PATH;
    }
    return path;
  }

}
