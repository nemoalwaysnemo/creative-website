import { Component, Input } from '@angular/core';
import { DocumentModel } from '@core/api';
import { DocumentListViewItem } from '../../document-list-view/document-list-view.interface';
import { AbstractSearchResultComponent } from '../abstract-search-result.component';
import { SearchQueryParamsService } from '../../services/search-query-params.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  template: `<a [routerLink]="['/p/creative/brand/', value.pid, 'campaign', value.uid]">{{ value.title }}</a>`,
})
export class CreativeBrandCampaignRowRenderComponent {
  @Input() value: { title: string, uid: string, pid: string };
}

@Component({
  selector: 'creative-brand-campaign-search-result',
  styleUrls: ['../thumbnail-view.scss'],
  templateUrl: './creative-brand-campaign-search-result.component.html',
})
export class CreativeBrandCampaignSearchResultComponent extends AbstractSearchResultComponent {

  @Input()
  set selectedView(name: string) {
    this.currentView = name;
    if (!this.listViewSettings) {
      this.listViewSettings = this.defaultSettings;
    }
  }

  @Input() layout: string = 'quarter';

  @Input() resultHeader: string;

  @Input() hideEmpty: boolean = false;

  parentId: string = this.activatedRoute.snapshot.params.id;

  listViewSettings: any;

  private defaultSettings: any = {
    columns: {
      title: {
        title: 'Title',
        sort: false,
        type: 'custom',
        renderComponent: CreativeBrandCampaignRowRenderComponent,
      },
      edges: {
        title: 'Edges',
        sort: false,
      },
    },
  };

  listViewBuilder: Function = (docs: DocumentModel[]) => {
    const items = [];
    for (const doc of docs) {
      items.push(new DocumentListViewItem({
        uid: doc.uid,
        title: { title: doc.title, uid: doc.uid, pid: this.parentId },
        edges: doc.get('app_Edges:Tags_edges').join(', '),
      }));
    }
    return items;
  }

  constructor(
    protected queryParamsService: SearchQueryParamsService,
    protected activatedRoute: ActivatedRoute,
    ) {
    super(queryParamsService);
  }

  protected onInit(): void {
    this.onQueryParamsChanged();
  }
}
