import { Component, OnInit, OnDestroy } from '@angular/core';
import { DocumentModel, AdvanceSearch } from '@core/api';
import { DatePipe } from '@angular/common';
import { ListViewItem } from '../../list-view/list-view.interface';
import { SearchQueryParamsService } from '../../services/search-query-params.service';
import { BaseSearchResultComponent } from '../abstract-search-result';

@Component({
  selector: 'tbwa-asset-search-result',
  styleUrls: ['./asset-search-result.component.scss'],
  templateUrl: './asset-search-result.component.html',
})
export class AssetSearchResultComponent extends BaseSearchResultComponent implements OnInit, OnDestroy {

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
        productionDate: {
          title: 'Production Date',
          sort: false,
          valuePrepareFunction: (value: any) => {
            return value ? new DatePipe('en-US').transform(value, 'yyyy-MM-dd') : null;
          },
        },
        campaign: {
          title: 'Campaign',
          sort: false,
        },
        ceativeDirector: {
          title: 'Creative Director',
          sort: false,
        },
        artDirector: {
          title: 'Art Director ',
          sort: false,
        },
        producer: {
          title: 'Producer',
          sort: false,
        },
        jobNRUR: {
          title: 'Job Nr/UR',
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
