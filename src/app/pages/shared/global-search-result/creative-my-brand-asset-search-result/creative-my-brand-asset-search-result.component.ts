import { Component, Input } from '@angular/core';
import { DocumentModel } from '@core/api';
import { AbstractSearchResultComponent } from '../abstract-search-result.component';
import { DocumentListViewItem } from '../../document-list-view/document-list-view.interface';
import { SearchQueryParamsService } from '../../services/search-query-params.service';

@Component({
  template: `<a [routerLink]="['/p/search/creative/myBrandAsset', value.uid]">{{ value.title }}</a>`,
})
export class CreativeBrandRowRenderComponent {
  @Input() value: { title: string, uid: string };
}

@Component({
  selector: 'creative-my-brand-asset-search-result',
  styleUrls: ['../thumbnail-view.scss'],
  templateUrl: './creative-my-brand-asset-search-result.component.html',
})
export class CreativeMyBrandAssetSearchResultComponent extends AbstractSearchResultComponent {

  @Input()
  set selectedView(name: string) {
    this.currentView = name;
    if (!this.listViewSettings) {
      this.listViewSettings = this.defaultSettings;
    }
  }

  @Input() resultHeader: string;

  @Input() layout: string = 'my_brand full-width';

  listViewSettings: any;

  private defaultSettings: any = {
    columns: {
      title: {
        title: 'Title',
        sort: false,
        type: 'custom',
        renderComponent: CreativeBrandRowRenderComponent,
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

  constructor(protected queryParamsService: SearchQueryParamsService) {
    super(queryParamsService);
  }

  protected onInit(): void {

  }

}
