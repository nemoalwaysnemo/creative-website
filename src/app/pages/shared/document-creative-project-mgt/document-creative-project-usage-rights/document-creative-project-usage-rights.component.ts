import { Component, Input } from '@angular/core';
import { DocumentModel, SearchResponse, AdvanceSearchService, NuxeoAutomations, NuxeoPagination } from '@core/api';
import { Subject, timer, Observable, of as observableOf } from 'rxjs';
import { ListSearchRowCustomViewComponent } from '../../list-search-form';
import { ListSearchRowCustomViewSettings } from '../../list-search-form/list-search-form.interface';
import { DocumentListViewItem } from '../../document-list-view/document-list-view.interface';
import { GlobalSearchFormSettings } from '../../global-search-form/global-search-form.interface';
import { NUXEO_DOC_TYPE } from '@environment/environment';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'document-creative-project-usage-rights',
  styleUrls: ['../document-creative-project-mgt.component.scss'],
  templateUrl: './document-creative-project-usage-rights.component.html',
})
export class DocumentCreativeProjectUsageRightsComponent {

  loading: boolean = true;

  doc: DocumentModel;

  baseParams$: Subject<any> = new Subject<any>();

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    source: 'document-creative-project-usage-rights',
    enableSearchInput: false,
  });

  listViewSettings: any = {
    columns: {
      title: {
        title: 'Title',
        sort: false,
      },
      usageRights: {
        title: 'Usage Rights',
        sort: false,
        type: 'custom',
        renderComponentData: new ListSearchRowCustomViewSettings({
          viewType: 'thumbnail',
        }),
        renderComponent: ListSearchRowCustomViewComponent,
      },
    },
  };

  listViewBuilder: Function = (docs: DocumentModel[]): any => {
    const items = [];
    for (const doc of docs) {
      items.push(new DocumentListViewItem({
        uid: doc.uid,
        title: doc.title,
        usageRights: doc,
      }));
    }
    return items;
  }

  @Input()
  set document(doc: DocumentModel) {
    if (doc) {
      this.doc = doc;
      this.loading = false;
      timer(0).subscribe(() => { this.baseParams$.next(this.buildAssetParams(doc, doc.getParent('brand'))); });
    }
  }

  afterSearch: Function = (res: SearchResponse): Observable<SearchResponse> => {
    return this.getUsageRightsStatus(res);
  }

  constructor(
    private advanceSearchService: AdvanceSearchService,
  ) { }


  onSelected(row: any): void {

  }

  protected buildAssetParams(doc: DocumentModel, brand: DocumentModel): any {
    const params = {
      ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_UR_CONTRACT_TYPES,
      currentPageIndex: 0,
      pageSize: 20,
      ecm_fulltext: '',
    };
    if (doc) {
      params['ecm_uuid_not_eq'] = doc.uid;
      params['the_loupe_main_jobtitle_any'] = `["${doc.get('The_Loupe_Main:jobtitle')}"]`;
    }
    if (brand) {
      params['ecm_path'] = brand.path;
    }
    return params;
  }

  protected getUsageRightsStatus(res: SearchResponse): Observable<SearchResponse> {
    const uids: string[] = res.response.entries.map((doc: DocumentModel) => doc.uid);
    if (uids.length > 0) {
      return this.advanceSearchService.operation(NuxeoAutomations.GetDocumentURStatus, { 'uuids': `${uids.join(',')}` }).pipe(
        tap(_ => {
          console.log(_);
        }),
        // map((response: NuxeoPagination) => {
        //   response.entries.forEach((doc: DocumentModel) => {

        //   });
        //   return res;
        // }),
      );
    }
    return observableOf(res);
  }

}
