import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { DocumentModel, AdvanceSearch, NuxeoPageProviderParams } from '@core/api';
import { PaginationDataSource } from '@pages/shared/pagination/pagination-data-source';
import { ListViewItem } from '../../list-view/list-view.interface';
import { SearchQueryParamsService } from '../../services/search-params.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'tbwa-brand-search-result',
  styleUrls: ['./search-result.component.scss'],
  templateUrl: './search-result.component.html',
})
export class BrandSearchResultComponent implements OnInit, OnDestroy {

  layout = 'search-results';

  loading: boolean = false;

  @Input() hasSearched: boolean = true;

  currentView = 'thumbnailView';

  documentType = 'brand';

  documents: DocumentModel[] = [];

  listDocuments: ListViewItem[] = [];

  totalResults = 0;

  paginationService: PaginationDataSource = new PaginationDataSource();

  listViewSettings: any = {
    columns: {
      title: {
        title: 'Title',
        sort: false,
      },
    },
  };

  queryParams: NuxeoPageProviderParams = {};

  private subscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    private advanceSearch: AdvanceSearch,
    private queryParamsService: SearchQueryParamsService,
  ) {
  }

  ngOnInit() {
    this.onSearch();
    this.onPageChanged();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.documents = [];
  }

  changeToGridView() {
    this.currentView = 'thumbnailView';
  }

  changeToListView() {
    this.currentView = 'listView';
  }

  private onSearch(): void {
    const subscription = this.advanceSearch.onSearch().subscribe(({ response, queryParams, action }) => {
      if (action === 'beforeSearch') {
        this.hasSearched = true;
        this.loading = true;
      } else if (this.hasSearched) {
        this.queryParams = queryParams;
        this.loading = false;
        this.paginationService.from(response);
        this.totalResults = response.resultsCount;
        this.documents = response.entries;
        this.listDocuments = this.buildListViewItem(response.entries);
      }
    });
    this.subscription.add(subscription);
  }

  private onPageChanged() {
    const subscription = this.paginationService.onPageChanged().subscribe((pageInfo: any) => {
      const currentPageIndex = pageInfo.currentPageIndex;
      this.queryParamsService.changeQueryParams([], { currentPageIndex }, 'merge');
    });
    this.subscription.add(subscription);
  }

  private buildListViewItem(docs: DocumentModel[]): ListViewItem[] {
    const items = [];
    for (const doc of docs) {
      items.push(new ListViewItem({
        uid: doc.uid,
        title: doc.title,
        productionDate: doc.get('The_Loupe_ProdCredits:production_date'),
        campaign: doc.get('The_Loupe_Main:campaign'),
        ceativeDirector: doc.get('The_Loupe_Credits:creativeDirector'),
        artDirector: doc.get('The_Loupe_Credits:artProducer'),
        producer: doc.get('The_Loupe_Credits:producer'),
        jobNRUR: doc.get('The_Loupe_Main:jobnumber'),
      }));
    }
    return items;
  }

}
