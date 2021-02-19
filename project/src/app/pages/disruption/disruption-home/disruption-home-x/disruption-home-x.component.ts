import { Component, EventEmitter, Output, TemplateRef } from '@angular/core';
import { NuxeoPagination, DocumentModel, GlobalSearchParams } from '@core/api';
import { BaseDocumentViewComponent } from '../../../shared/abstract-classes/base-document-view.component';
import { DocumentPageService } from '../../../shared/services/document-page.service';
import { concatMap, takeWhile, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { GlobalDocumentDialogService, GlobalDocumentDialogSettings, GLOBAL_DOCUMENT_DIALOG } from '../../../shared/global-document-dialog';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';
import { GLOBAL_DOCUMENT_FORM } from '../../../shared/global-document-form';

@Component({
  selector: 'disruption-home-x',
  styleUrls: ['./disruption-home-x.component.scss'],
  templateUrl: './disruption-home-x.component.html',
})
export class DisruptionHomeXComponent extends BaseDocumentViewComponent {

  @Output() customEvent: EventEmitter<any> = new EventEmitter<any>();

  loading: boolean = true;

  disruptionTitle: string = 'DisruptionX';

  redirectUrl: string = '/p/disruption/home';

  enableFeature: boolean = false;

  documents: DocumentModel[] = [];

  parentDocument: DocumentModel;

  dialogMetadata: any = {
    formMode: 'edit',
    enableEdit: true,
    moreInfo: false,
    enableThumbnailImg: true,
    enableDeletion: true,
  };

  dialogSettings: GlobalDocumentDialogSettings = new GlobalDocumentDialogSettings({
    components: [
      GLOBAL_DOCUMENT_DIALOG.PREVIEW_DISRUPTION_X,
      GLOBAL_DOCUMENT_FORM.DISRUPTION_X_MODULE_ASSET_FORM,
      GLOBAL_DOCUMENT_DIALOG.CUSTOM_DELETION,
    ],
    main: GLOBAL_DOCUMENT_DIALOG.PREVIEW_DISRUPTION_X,
  });

  private params: any = {
    pageSize: 1,
    currentPageIndex: 0,
    ecm_path_eq: NUXEO_PATH_INFO.DISRUPTION_X_FOLDER_PATH,
    ecm_primaryType: NUXEO_DOC_TYPE.DISRUPTION_X_FOLDER_TYPE,
  };

  private assetParams: any = {
    pageSize: 12,
    currentPageIndex: 0,
    ecm_primaryType: NUXEO_DOC_TYPE.DISRUPTION_X_TYPE,
    ecm_path: NUXEO_PATH_INFO.DISRUPTION_X_FOLDER_PATH,
  };

  constructor(
    protected documentPageService: DocumentPageService,
    private globalDocumentDialogService: GlobalDocumentDialogService,
  ) {
    super(documentPageService);
  }

  onInit(): void {
    this.performFolders();
  }

  openDialog(dialog: TemplateRef<any>, closeOnBackdropClick: boolean = true): void {
    this.globalDocumentDialogService.open(dialog, { closeOnBackdropClick });
  }

  private performFolders(): void {
    const subscription = this.search(this.params).pipe(
      map((docs: DocumentModel[]) => docs.shift()),
      takeWhile((doc: DocumentModel) => {
        if (doc) {
          this.parentDocument = doc;
          this.disruptionTitle = doc.title;
          this.enableFeature = doc && doc.get('app_global:enable_feature') === true;
        }
        this.customEvent.next({ featureEnabled: this.enableFeature });
        return this.enableFeature;
      }),
      concatMap(_ => this.search(this.assetParams)),
    ).subscribe((docs: DocumentModel[]) => {
      this.documents = docs;
      this.loading = false;
    });
    this.subscription.add(subscription);
  }

  private search(params: {}): Observable<DocumentModel[]> {
    return this.documentPageService.advanceRequest(new GlobalSearchParams(params)).pipe(
      map((res: NuxeoPagination) => res.entries),
    );
  }

}
