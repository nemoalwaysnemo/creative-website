import { Component, Input } from '@angular/core';
import { DocumentModel, SearchResponse, AdvanceSearchService, NuxeoAutomations, NuxeoPagination } from '@core/api';
import { Subject, timer, Observable, of as observableOf } from 'rxjs';
import { assetPath } from '@core/services/helpers';
import { ListSearchRowCustomViewComponent } from '../../../list-search-form';
import { ListSearchRowCustomViewSettings } from '../../../list-search-form/list-search-form.interface';
import { DocumentListViewItem } from '../../../document-list-view/document-list-view.interface';
import { GlobalSearchFormSettings } from '../../../global-search-form/global-search-form.interface';
import { NUXEO_DOC_TYPE } from '@environment/environment';
import { map } from 'rxjs/operators';
@Component({
  selector: 'creative-project-report-buyout-talent-information',
  styleUrls: ['../../document-creative-project-mgt.component.scss'],
  templateUrl: './document-creative-project-report-buyout-talent-information.component.html',
})
export class DocumentCreativeProjectReportBuyontTalentInformationComponent {

  constructor(
    private advanceSearchService: AdvanceSearchService,
  ) { }

  loading: boolean = true;

  doc: DocumentModel;

  baseParams$: Subject<any> = new Subject<any>();

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    source: 'creative-project-report-buyout-talent-information',
    enableSearchInput: false,
  });

  listViewSettings: any = {
    // hideHeader: true,
    hideSubHeader: true,
    selectMode: 'single', // single|multi
    columns: {
      icon: {
        title: 'Icon',
        sort: false,
        type: 'custom',
        renderComponentData: new ListSearchRowCustomViewSettings({
          viewType: 'icon',
        }),
        renderComponent: ListSearchRowCustomViewComponent,
      },
      title: {
        title: 'TALENT NAME',
        sort: false,
      },
      usageRights: {
        title: 'Expiry',
        sort: false,
        type: 'custom',
        renderComponentData: new ListSearchRowCustomViewSettings({
          viewType: 'usage-rights-expiry',
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
        icon: { url: assetPath('assets/images/app-library-UR-contract-talent.png') },
        title: doc['managed_item'],
        info: doc,
        usageRights: doc.get('_usage_rights_'),
      }));
    }
    return items;
  }

  afterSearch: Function = (res: SearchResponse): Observable<SearchResponse> => {
    return this.getUsageRightsStatus(res);
  }

  @Input()
  set document(doc: DocumentModel) {
    if (doc) {
      this.doc = doc;
      this.loading = false;
      timer(0).subscribe(() => { this.baseParams$.next(this.buildAssetParams(doc, doc.getParent('brand'))); });
    }
  }

  onSelected(row: any): void {

  }

  protected buildAssetParams(doc: DocumentModel, brand: DocumentModel): any {
    const params = {
      ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_UR_TALENT_TYPE,
      currentPageIndex: 0,
      pageSize: 20,
      ecm_fulltext: '',
    };
    if (doc) {
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
      return this.advanceSearchService.operation(NuxeoAutomations.GetDocumentURStatus, { 'uuids': `${uids.join(',')}`, 'entityType': 'contract' }).pipe(
        map((response: NuxeoPagination) => {
          res.response.entries.forEach((doc: DocumentModel) => {
            const status = response.entries.find((x: any) => x.uuid === doc.uid);
            doc.properties['_usage_rights_'] = status || {};
          });
          return res;
        }),
      );
    }
    return observableOf(res);
  }
}
