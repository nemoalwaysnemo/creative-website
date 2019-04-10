import { Component } from '@angular/core';
import { DocumentModel } from '@core/api';
import { ListViewItem } from '../../list-view/list-view.interface';

@Component({
  selector: 'tbwa-creative-my-brand-search-result',
  styleUrls: ['./creative-my-brand-search-result.component.scss'],
  templateUrl: './creative-my-brand-search-result.component.html',
})
export class CreativeMyBrandSearchResultComponent {

  listViewSettings: any = {
    columns: {
      title: {
        title: 'Title',
        sort: false,
      },
    },
  };

  listViewBuilder: Function = (docs: DocumentModel[]) => {
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
