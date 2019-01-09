import { Component, Input } from '@angular/core';

@Component({
  selector: 'tbwa-search-result-list',
  styleUrls: ['./search-result-list.component.scss'],
  templateUrl: './search-result-list.component.html',
})
export class SearchResultListComponent {

  @Input() listDocuments: [];

  listSettings: any = {
    mode: 'inline', // inline|external|click-to-edit
    selectMode: 'single', // single|multi
    hideHeader: false,
    hideSubHeader: true,
    actions: {
      position: 'none', // left|right
    },
    noDataMessage: 'No data found',
    pager: {
      display: false,
    },
    rowClassFunction: () => '',
    columns: {
      img: {
        title: 'Preview',
        type: 'html',
      },
      title: {
        title: 'Title',
        type: 'html',
        sort: false,
      },
      date: {
        title: 'Year',
        sort: false,
      },
      description: {
        title: 'Description',
        type: 'html',
        sort: false,
      },
      agency: {
        title: 'Agency',
        sort: false,
      },
    },
  };
}
