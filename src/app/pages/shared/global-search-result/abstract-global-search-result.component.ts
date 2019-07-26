import { Input } from '@angular/core';
import { DocumentModel, AdvanceSearch, NuxeoPageProviderParams, SearchResponse, NuxeoPagination, NuxeoRequestOptions } from '@core/api';
import { PaginationDataSource } from '../pagination/pagination-data-source';
import { SearchQueryParamsService } from '../services/search-query-params.service';
import { DocumentListViewItem } from '../document-list-view/document-list-view.interface';
import { concatMap, map } from 'rxjs/operators';
import { AbstractSearchResultComponent } from './abstract-search-result.component';
import { of as observableOf, Observable } from 'rxjs';

export abstract class AbstractGlobalSearchResultComponent extends AbstractSearchResultComponent {

  loading: boolean = false;

  layout: string = 'search-results';

  documents: DocumentModel[] = [];

  listDocuments: DocumentListViewItem[] = [];

  totalResults: number = 0;

  listViewSetting: any = {};

  paginationService: PaginationDataSource = new PaginationDataSource();

  searchParams: NuxeoPageProviderParams = new NuxeoPageProviderParams();

  multiView: boolean = false;

  @Input() currentView: string = 'thumbnailView';

  @Input()
  set listViewSettings(settings: any) {
    if (settings) {
      this.multiView = true;
      this.listViewSetting = settings;
    }
  }

  @Input() listViewBuilder: Function = (documents: DocumentModel[]) => { };

  constructor(protected advanceSearch: AdvanceSearch, protected queryParamsService: SearchQueryParamsService) {
    super(queryParamsService);
  }

  changeToGridView(): void {
    this.currentView = 'thumbnailView';
  }

  changeToListView(): void {
    this.currentView = 'listView';
  }

  protected onInit(): void {
    this.onSearch();
    this.onPageChanged();
  }

  protected onSearch(): void {
    const subscription = this.advanceSearch.onSearch().pipe(
      concatMap((res: SearchResponse) => this.afterSearch(res)),
    ).subscribe((res: SearchResponse) => {
      if (res.action === 'beforeSearch') {
        this.loading = true;
      } else {
        this.loading = false;
        this.searchParams = res.searchParams;
        this.handleResponse(res);
      }
    });
    this.subscription.add(subscription);
  }

  protected onPageChanged(): void {
    const subscription = this.paginationService.onPageChanged().subscribe((pageInfo: any) => {
      const currentPageIndex = pageInfo.currentPageIndex;
      this.queryParamsService.changeQueryParams({ currentPageIndex }, { type: 'pagination' }, 'merge');
    });
    this.subscription.add(subscription);
  }

  protected handleResponse(res: SearchResponse): void {
    this.paginationService.from(res.response);
    this.totalResults = res.response.resultsCount;
    this.documents = res.response.entries;

    const subscription = this.requestCampaignTitle(res.response.entries).subscribe((doc: DocumentModel[]) => {
      this.listDocuments = this.listViewBuilder(doc);
    });
    this.subscription.add(subscription);
  }

  protected requestCampaignTitle(docs: DocumentModel[]): Observable<DocumentModel[]> {
    const ids = [];
    docs.forEach((doc: DocumentModel) => {
      if (doc.get('The_Loupe_Main:campaign')) ids.push(doc.get('The_Loupe_Main:campaign'));
    });

    const distIds = Array.from(new Set(ids));
    if (distIds.length > 0) {
      const params = {
        ecm_uuid: `["${distIds.join('", "')}"]`,
        pageSize: 999,
      };

      return this.advanceSearch.request(new NuxeoPageProviderParams(params), new NuxeoRequestOptions({ schemas: ['The_Loupe_Main'] })).pipe(
        map((response: NuxeoPagination) => {
          const listNew: any = {};
          response.entries.forEach((resDoc: DocumentModel) => { listNew[resDoc.uid] = resDoc.title; });

          for (const doc of docs) {
            doc.properties['The_Loupe_Main:campaign_title'] = listNew[doc.get('The_Loupe_Main:campaign')] ? listNew[doc.get('The_Loupe_Main:campaign')] : null;
          }

          return docs;
        }),
      );
    }

    return observableOf(docs);
  }
}
