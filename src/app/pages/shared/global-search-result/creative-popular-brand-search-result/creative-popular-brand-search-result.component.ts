import { Component, Input } from '@angular/core';
import { DocumentModel } from '@core/api';
import { AbstractSearchResultComponent } from '../abstract-search-result.component';
import { DocumentListViewItem } from '../../document-list-view/document-list-view.interface';

@Component({
  template: `<a [routerLink]="['/p/search/creative/popularBrandAsset', value.uid]">{{ value.title }}</a>`,
})
export class PopularBrandRowRenderComponent {
  @Input() value: { title: string, uid: string };
}

@Component({
  selector: 'creative-popular-brand-search-result',
  styleUrls: ['../thumbnail-view.scss'],
  templateUrl: './creative-popular-brand-search-result.component.html',
})
export class CreativePopularBrandSearchResultComponent extends AbstractSearchResultComponent {

  @Input()
  set selectedView(name: string) {
    this.currentView = name;
    if (!this.listViewSettings) {
      this.listViewSettings = this.defaultSettings;
    }
  }

  @Input() layout: string = 'quarter';
  listViewSettings: any;

  private defaultSettings: any = {
    columns: {
      title: {
        title: 'Title',
        sort: false,
        type: 'custom',
        renderComponent: PopularBrandRowRenderComponent,
      },
    },
  };

  listViewBuilder: Function = (docs: DocumentModel[]) => {
    const items = [];
    for (const doc of docs) {
      items.push(new DocumentListViewItem({
        uid: doc.uid,
        title: { title: doc.title, uid: doc.uid },
        productionDate: doc.get('The_Loupe_ProdCredits:production_date'),
        campaign: doc.get('The_Loupe_Main:campaign_title_'),
        ceativeDirector: doc.get('The_Loupe_Credits:creativeDirector'),
        artDirector: doc.get('The_Loupe_Credits:artProducer'),
        producer: doc.get('The_Loupe_Credits:producer'),
        jobNRUR: doc.get('The_Loupe_Main:jobnumber'),
      }));
    }
    return items;
  }

  protected onInit(): void {

  }

}
