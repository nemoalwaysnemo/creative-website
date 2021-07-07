import { Component, Input } from '@angular/core';
import { DocumentModel, SearchResponse } from '@core/api';
import { DocumentListViewItem } from '../../document-list-view/document-list-view.interface';
import { SelectableItemSettings } from '../../document-selectable';
import { BaseSearchResultComponent } from '../base-search-result.component';
import { ListSearchRowCustomViewSettings } from '../../../shared/list-search-form/list-search-form.interface';
import { ListSearchRowCustomViewComponent } from '../../../shared/list-search-form-in-dialog/list-search-row-custom-view-component';

@Component({
  template: `<a [routerLink]="">{{ value.title }}</a>`,
})
export class CreativeRingAgencyRowRenderComponent {
  @Input() value: { title: string, uid: string };
}

@Component({
  selector: 'creative-ring-agency-search-result',
  styleUrls: ['../thumbnail-view.scss', './creative-ring-agency-search-result.component.scss'],
  templateUrl: './creative-ring-agency-search-result.component.html',
})
export class CreativeRingAgencySearchResultComponent extends BaseSearchResultComponent {

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
    hideHeader: true,
    hideSubHeader: true,
    columns: {
      action: {
        sort: false,
        type: 'custom',
        renderComponentData: new ListSearchRowCustomViewSettings({
          viewType: 'thumbnail',
        }),
        renderComponent: ListSearchRowCustomViewComponent,
      },
      agency: {
        sort: false,
        type: 'custom',
        renderComponent: CreativeRingAgencyRowRenderComponent,
      },
      country: {
        sort: false,
        type: 'custom',
        renderComponent: CreativeRingAgencyRowRenderComponent,
      },
    },
  };

  searchResultFilter(res: SearchResponse): boolean {
    return res.source === 'creative-ring-agency';
  }

  listViewBuilder: (docs: DocumentModel[]) => any = (docs: DocumentModel[]) => {
    const items = [];
    for (const doc of docs) {
      items.push(new DocumentListViewItem({
        uid: doc.uid,
        action: doc,
        agency: { title: doc.title, uid: doc.uid },
        country: doc.get('The_Loupe_Main:country'),
      }));
    }
    return items;
  }

  protected onInit(): void {
    this.onQueryParamsChanged();
  }
}
