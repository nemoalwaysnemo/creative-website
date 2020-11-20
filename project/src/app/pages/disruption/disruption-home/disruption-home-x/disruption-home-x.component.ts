import { Component } from '@angular/core';
import { NuxeoPagination, DocumentModel, GlobalSearchParams, NuxeoSearchConstants } from '@core/api';
import { BaseDocumentViewComponent } from '../../../shared/abstract-classes/base-document-view.component';
import { DocumentPageService } from '../../../shared/services/document-page.service';
import { concatMap, takeWhile, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'disruption-home-x',
  styleUrls: ['./disruption-home-x.component.scss'],
  templateUrl: './disruption-home-x.component.html',
})
export class DisruptionHomeXComponent extends BaseDocumentViewComponent {

  loading: boolean = true;

  enableFeature: boolean = false;

  documents: DocumentModel[] = [];

  private params: any = {
    pageSize: 8,
    currentPageIndex: 0,
    ecm_mixinType: NuxeoSearchConstants.HiddenInNavigation,
    ecm_path_eq: NUXEO_PATH_INFO.DISRUPTION_X_FOLDER_PATH,
    ecm_primaryType: NUXEO_DOC_TYPE.DISRUPTION_X_FOLDER_TYPE,
  };

  private assetParams: any = {
    pageSize: 1,
    currentPageIndex: 0,
    ecm_primaryType: NUXEO_DOC_TYPE.DISRUPTION_X_TYPE,
    ecm_path: NUXEO_PATH_INFO.DISRUPTION_X_FOLDER_PATH,
  };

  constructor(protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }

  onInit(): void {
    this.performFolders();
  }

  private performFolders(): void {
    const subscription = this.search(this.params).pipe(
      map((docs: DocumentModel[]) => docs.shift()),
      takeWhile((doc: DocumentModel) => {
        this.enableFeature = doc && doc.get('app_global:enable_feature') === true;
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
