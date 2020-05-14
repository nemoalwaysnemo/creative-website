import { Component, Input } from '@angular/core';
import { DocumentModel } from '@core/api';
import { DocumentListViewItem } from '../../document-list-view/document-list-view.interface';
import { AbstractSearchResultComponent } from '../abstract-search-result.component';
import { SearchQueryParamsService } from '../../services/search-query-params.service';

@Component({
  selector: 'creative-agency-asset-search-result',
  styleUrls: ['../thumbnail-view.scss'],
  templateUrl: './creative-agency-asset-search-result.component.html',
})
export class CreativeAgencyAssetSearchResultComponent extends AbstractSearchResultComponent {

  @Input() resultHeader: string;

  @Input() layout: string = 'brand full-width';

  listViewBuilder: Function = (docs: DocumentModel[]): any => {
    const items = [];
    for (const doc of docs) {
      items.push(new DocumentListViewItem({
        uid: doc.uid,
        title: doc.title,
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
