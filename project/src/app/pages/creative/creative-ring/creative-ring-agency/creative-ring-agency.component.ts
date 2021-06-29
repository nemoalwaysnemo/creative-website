import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, timer } from 'rxjs';
import { DocumentModel, UserModel } from '@core/api';
import { SelectableItemService } from '../../../shared/document-selectable';
import { GlobalDocumentViewComponent, DocumentPageService, GlobalSearchFormSettings, SearchFilterModel } from '@pages/shared';
import { NUXEO_DOC_TYPE, NUXEO_PATH_INFO } from '@environment/environment';

@Component({
  selector: 'creative-ring-agency',
  styleUrls: ['../../../../theme/styles/document-metadata-view.scss', './creative-ring-agency.component.scss'],
  templateUrl: './creative-ring-agency.component.html',
})
export class CreativeRingAgencyComponent extends GlobalDocumentViewComponent {

  baseParams$: Subject<any> = new Subject<any>();

  // searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
  //   source: 'creative-ring-my-collections',
  //   enableQueryParams: true,
  // });

  onSearching: boolean = true;

  constructor(
    private selectableItemService: SelectableItemService,
    protected activatedRoute: ActivatedRoute,
    protected documentPageService: DocumentPageService,
  ) {
    super(activatedRoute, documentPageService);
  }

  onInit(): void {
    const subscription = this.searchCurrentDocument(this.getCurrentDocumentSearchParams()).subscribe();
    this.subscription.add(subscription);
  }

  onLoading(loading: boolean): void {
    this.onSearching = loading;
  }


  protected setCurrentDocument(doc: DocumentModel, user: UserModel): void {
    super.setCurrentDocument(doc, user);
    // if (doc) {
    //   timer(0).subscribe(() => { this.baseParams$.next(this.buildAssetsParams(doc, user)); });
    //   this.selectableItemService.clear();
    // }
  }

  protected getCurrentDocumentSearchParams(): any {
    return {
      pageSize: 1,
      currentPageIndex: 0,
      ecm_path: NUXEO_PATH_INFO.CREATIVE_BASE_FOLDER_PATH,
      ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_RING_FOLDER_TYPE,
    };
  }

  // protected buildAssetsParams(doc: DocumentModel, user: UserModel): any {
  //   // my collections
  //   const params: any = {
  //     currentPageIndex: 0,
  //     ecm_fulltext: '',
  //     ecm_path: NUXEO_PATH_INFO.CREATIVE_BASE_FOLDER_PATH,
  //     ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_RING_COLLECTION_TYPE,
  //   };
  //   if (doc) {
  //     params['dc_creator'] = `["${user.username}"]`;
  //   }
  //   return params;
  // }

}
