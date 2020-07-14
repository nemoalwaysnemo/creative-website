import { Component, Input } from '@angular/core';
import { DocumentModel } from '@core/api';
import { DatePipe } from '@angular/common';
import { DocumentListViewItem } from '../../document-list-view/document-list-view.interface';
import { SelectableItemSettings } from '../../selectable-item/selectable-item.interface';
import { BaseSearchResultComponent } from '../base-search-result.component';
import { DocumentPageService } from '../../services/document-page.service';

@Component({
  template: `<a [routerLink]="['/p/creative/asset', value.uid]">{{ value.title }}</a>`,
})
export class CreativeDocumentAssetRowRenderComponent {
  @Input() value: { title: string, uid: string };
}

@Component({
  selector: 'creative-document-asset-search-result',
  styleUrls: ['../thumbnail-view.scss'],
  templateUrl: './creative-document-asset-search-result.component.html',
})
export class CreativeDocumentAssetSearchResultComponent extends BaseSearchResultComponent {

  @Input()
  set selectedView(name: string) {
    this.currentView = name;
    if (!this.listViewSettings) {
      this.listViewSettings = this.defaultSettings;
    }
  }

  @Input() layout: string;

  @Input() resultHeader: string = '';

  @Input() hideEmpty: boolean = false;

  listViewSettings: any;

  selectableSettings: SelectableItemSettings = new SelectableItemSettings({
    enableSelectable: false,
  });

  private defaultSettings: any = {
    columns: {
      title: {
        title: 'Title',
        sort: false,
        type: 'custom',
        renderComponent: CreativeDocumentAssetRowRenderComponent,
      },
      brand: {
        title: 'Brand',
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
        title: 'Art Director',
        sort: false,
      },
      jobNRUR: {
        title: 'Job Nr/UR',
        sort: false,
      },
    },
  };

  listViewBuilder: Function = (docs: DocumentModel[]): any => {
    const items = [];
    for (const doc of docs) {
      items.push(new DocumentListViewItem({
        uid: doc.uid,
        title: { title: doc.title, uid: doc.uid },
        brand: doc.get('The_Loupe_Main:brand').join(', '),
        productionDate: doc.get('The_Loupe_ProdCredits:production_date'),
        campaign: doc.get('The_Loupe_Main:campaign_title_'),
        ceativeDirector: doc.get('The_Loupe_Credits:creativeDirector'),
        artDirector: doc.get('The_Loupe_Credits:artProducer'),
        jobNRUR: doc.get('The_Loupe_Main:jobnumber'),
      }));
    }
    return items;
  }

  constructor(protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }

  protected onInit(): void {
    this.onQueryParamsChanged();
  }
}
