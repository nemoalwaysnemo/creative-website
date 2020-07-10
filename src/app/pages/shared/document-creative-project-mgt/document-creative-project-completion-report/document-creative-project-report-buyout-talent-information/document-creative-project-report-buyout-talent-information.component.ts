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
import { DatePipe } from '@angular/common';
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
    // schemas: ['dublincore', 'The_Loupe_Main', 'The_Loupe_Delivery', 'The_Loupe_ProdCredits', 'The_Loupe_Rights'],
    schemas: ['The_Loupe_ProdCredits', 'The_Loupe_Rights'],
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
      talentName: {
        sort: false,
        type: 'custom',
        title: 'TALENT NAME',
        renderComponentData: new ListSearchRowCustomViewSettings({
          viewType: 'html',
          htmlFunc: (doc: DocumentModel) => {
            return `
            <div class="delivery-title">
              <ul>
                <li>Production Company</li>
                <li>${ this.formatText(doc.get('The_Loupe_ProdCredits:production_company')['production_company'])}</li>
              </ul>
            </div>`;
          },
        }),
        renderComponent: ListSearchRowCustomViewComponent,
      },
      mediaCovered: {
        sort: false,
        type: 'custom',
        title: 'TERRITORY / MEDIA COVERED',
        renderComponentData: new ListSearchRowCustomViewSettings({
          viewType: 'html',
          htmlFunc: (doc: DocumentModel) => {
            return `
            <div class="delivery-title">
              <ul>
                <li>${ this.formatText(doc.get('The_Loupe_Rights:contract_items_usage_types')[0]['contract_countries'].join(','))}</li>
                <li>${ this.formatText(doc.get('The_Loupe_Rights:contract_items_usage_types')[0]['media_usage_type'].join(','))}</li>
                <li>Address</li>
                <li>${ this.formatText(doc.get('The_Loupe_ProdCredits:production_company')['production_company_address'])}</li>
              </ul>
            </div>`;
          },
        }),
        renderComponent: ListSearchRowCustomViewComponent,
      },
      term: {
        sort: false,
        type: 'custom',
        title: 'TERM (months)',
        renderComponentData: new ListSearchRowCustomViewSettings({
          viewType: 'html',
          htmlFunc: (doc: DocumentModel) => {
            return `
            <div class="delivery-title">
              <ul>
                <li>${ this.getMutipleData(doc.get('The_Loupe_Rights:contract_items_usage_types'))}</li>
                <li>Production Company Contact</li>
                <li>${ this.formatText(doc.get('The_Loupe_ProdCredits:production_company')['production_company_contact'])}</li>
              </ul>
            </div>`;
          },
        }),
        renderComponent: ListSearchRowCustomViewComponent,
      },
      usageRights: {
        sort: false,
        type: 'custom',
        title: 'Expiry',
        renderComponentData: new ListSearchRowCustomViewSettings({
          viewType: 'html',
          htmlFunc: (doc: DocumentModel) => {
            return `
            <div class="delivery-title">
              <ul>
                <li>${ this.formatExpire(doc.get('_usage_rights_'))}</li>
                <li>Phone/Email</li>
                <li>${ this.formatText(doc.get('The_Loupe_ProdCredits:production_company')['production_company_phone_email'])}</li>
              </ul>
            </div>`;
          },
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
        talentName: doc,
        mediaCovered: doc,
        term: doc,
        usageRights: doc,
      }));
    }
    return items;
  }

  formatText(text: any) {
    return text === null ? '' : text;
  }

  formatExpire(value: any) {
    if (value.all_error_messages && value.all_error_messages.length > 0) {
      return value.error_messages;
    } else if (value.info_messages && value.info_messages.length > 0) {
      return value.info_messages;
    } else if (value.info_messages && value.info_messages.length === 0 && value.info_messages.length === value.all_error_messages.length) {
      return value.end_date ? new DatePipe('en-US').transform(value.end_date, 'yyyy-MM-dd') : 'N/A';
    }
  }

  getMutipleData(doc: any) {
    return doc.length > 0 ? doc.map(obj => obj['contract_duration']).join('  ') : '';
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
