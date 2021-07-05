import { Component, Input } from '@angular/core';
import { DocumentModel, SearchResponse } from '@core/api';

@Component({
  selector: 'creative-ring-my-collections-search-result',
  styleUrls: ['../thumbnail-view.scss'],
  templateUrl: './creative-ring-my-collections-search-result.component.html',
})
export class CreativeRingMyCollectionsSearchResultComponent {

  @Input() enableScrolling: boolean = true;

  loadingStyle: any = { 'min-height': '400px' };

  searchResultFilter(res: SearchResponse): boolean {
    return res.source === 'creative-ring-my-collections';
  }

  getAssetUrl(doc: DocumentModel): string {
    let url: string = '/p/creative/ring/:type/:uid/asset';
    switch (doc.get('The_Loupe_Main:collection_type')) {
      case 'Brand Collection':
        url = url.replace(':type', 'brand');
        break;
      default:
        url = url.replace(':type', 'collection');
        break;
    }
    return url.replace(':uid', doc.uid);
  }
}
