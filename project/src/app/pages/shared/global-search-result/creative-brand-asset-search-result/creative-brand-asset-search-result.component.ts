import { Component, Input } from '@angular/core';
import { DocumentModel } from '@core/api';
import { BaseSearchResultComponent } from '../base-search-result.component';
import { DocumentListViewItem } from '../../document-list-view/document-list-view.interface';
import { DocumentPageService } from '../../services/document-page.service';

@Component({
  template: `<a [routerLink]="['/p/creative/brand', value.uid, 'asset']">{{ value.title }}</a>
  `,
})
export class CreativeBrandRowRenderComponent {
  @Input() value: { title: string; uid: string };
}

@Component({
  selector: 'creative-brand-asset-search-result',
  styleUrls: ['../thumbnail-view.scss'],
  templateUrl: './creative-brand-asset-search-result.component.html',
})
export class CreativeBrandAssetSearchResultComponent extends BaseSearchResultComponent {

  @Input()
  set selectedView(name: string) {
    this.currentView = name;
    if (!this.listViewSettings) {
      this.listViewSettings = this.defaultSettings;
    }
  }

  @Input() resultHeader: string;

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

  listViewBuilder: (docs: DocumentModel[]) => any = (docs: DocumentModel[]) => {
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
  };

  constructor(protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }

  protected onInit(): void {

  }

  protected getDefaultThumbnailViewSettings(): any {
    return {
      layout: 'my_brand full-width',
    };
  }

}
