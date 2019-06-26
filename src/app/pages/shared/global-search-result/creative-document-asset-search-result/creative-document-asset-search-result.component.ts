import { Component, Input } from '@angular/core';
import { DocumentModel } from '@core/api';
import { DatePipe } from '@angular/common';
import { DocumentListViewItem } from '../../document-list-view/document-list-view.interface';

@Component({
  selector: 'creative-document-asset-search-result',
  styleUrls: ['../thumbnail-view.scss'],
  templateUrl: './creative-document-asset-search-result.component.html',
})
export class CreativeDocumentAssetSearchResultComponent {

  showResult: boolean = false;

  @Input()
  set showListViewSettings(flag: boolean) {
    if (flag) {
      this.showResult = true;
      this.listViewSettings = null;
    }
  }

  listViewSettings: any = {
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

  listViewBuilder: Function = (docs: DocumentModel[]) => {
    const items = [];
    for (const doc of docs) {
      items.push(new DocumentListViewItem({
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
