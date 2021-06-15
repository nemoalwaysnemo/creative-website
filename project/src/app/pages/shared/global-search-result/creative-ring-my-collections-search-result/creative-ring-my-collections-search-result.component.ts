import { Component, Input } from '@angular/core';
import { SearchResponse } from '@core/api';

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

}
