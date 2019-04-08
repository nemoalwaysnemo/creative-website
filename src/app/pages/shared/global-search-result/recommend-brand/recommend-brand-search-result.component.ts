import { Component, OnInit, OnDestroy } from '@angular/core';
import { DocumentModel, AdvanceSearch } from '@core/api';
import { ListViewItem } from '../../list-view/list-view.interface';
import { SearchQueryParamsService } from '../../services/search-query-params.service';
import { BaseSearchResultComponent } from '../abstract-search-result';

@Component({
  selector: 'tbwa-recommend-brand-search-result',
  styleUrls: ['./recommend-brand-search-result.component.scss'],
  templateUrl: './recommend-brand-search-result.component.html',
})
export class RecommendedBrandSearchResultComponent extends BaseSearchResultComponent implements OnInit, OnDestroy {

  constructor(protected advanceSearch: AdvanceSearch, protected queryParamsService: SearchQueryParamsService) {
    super(advanceSearch, queryParamsService);
  }

  ngOnInit(): void {
    this.onInit();
  }

  ngOnDestroy(): void {
    this.onDestroy();
  }

  protected getListViewSettings(): any {
    return {
      columns: {
        title: {
          title: 'Title',
          sort: false,
        },
      },
    };
  }

  protected buildListViewItem(docs: DocumentModel[]): ListViewItem[] {
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
