import { Component, Input } from '@angular/core';
import { DocumentModel, SearchResponse } from '@core/api';
import { DocumentListViewItem } from '../../document-list-view/document-list-view.interface';
import { SelectableItemSettings } from '../../document-selectable';
import { BaseSearchResultComponent } from '../base-search-result.component';
import { ListSearchRowCustomViewSettings } from '../../../shared/list-search-form/list-search-form.interface';
import { ListSearchRowCustomViewComponent } from '../../../shared/list-search-form-in-dialog/list-search-row-custom-view-component';

@Component({
  template: `<a [routerLink]="['/p/creative/ring/brand/', value.uid, 'asset']">{{ value.title }}</a>`,
})
export class CreativeRingBrandRowRenderComponent {
  @Input() value: { title: string, uid: string };
}

@Component({
  selector: 'creative-ring-brand-search-result',
  styleUrls: ['../thumbnail-view.scss'],
  templateUrl: './creative-ring-brand-search-result.component.html',
})
export class CreativeRingBrandSearchResultComponent extends BaseSearchResultComponent {

  @Input()
  set selectedView(name: string) {
    this.currentView = name;
    if (!this.listViewSettings) {
      this.listViewSettings = this.defaultSettings;
    }
  }

  @Input() layout: string;

  @Input() hideEmpty: boolean = false;

  @Input() enableScrolling: boolean = true;

  @Input() selectableSettings: SelectableItemSettings = new SelectableItemSettings({
    enableSelectable: false,
  });

  listViewSettings: any;

  loadingStyle: any = { 'min-height': '400px' };

  private defaultSettings: any = {
    columns: {
      action: {
        sort: false,
        type: 'custom',
        renderComponentData: new ListSearchRowCustomViewSettings({
          viewType: 'thumbnail',
        }),
        renderComponent: ListSearchRowCustomViewComponent,
      },
      brand: {
        title: 'Brand',
        sort: false,
        type: 'custom',
        renderComponent: CreativeRingBrandRowRenderComponent,
      },
      assets: {
        title: '#Assets',
        sort: false,
      },
    },
  };

  searchResultFilter(res: SearchResponse): boolean {
    return res.source === 'creative-ring-brand';
  }

  listViewBuilder: (docs: DocumentModel[]) => any = (docs: DocumentModel[]) => {
    const items = [];
    for (const doc of docs) {
      items.push(new DocumentListViewItem({
        uid: doc.uid,
        action: doc,
        brand: { title: doc.title, uid: doc.uid },
        assets: doc.get('The_Loupe_Main:agency'),
      }));
    }
    return items;
  }

  protected onInit(): void {
    this.onQueryParamsChanged();
  }
}
