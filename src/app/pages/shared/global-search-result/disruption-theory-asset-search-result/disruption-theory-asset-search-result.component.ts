import { Component, Input } from '@angular/core';
import { SearchResponse } from '@core/api';

@Component({
  selector: 'disruption-theory-asset-search-result',
  styleUrls: ['../thumbnail-view.scss'],
  templateUrl: './disruption-theory-asset-search-result.component.html',
})
export class DisruptionTheoryAssetSearchResultComponent {


  hasPagination: boolean = false;

  @Input() responseHandler: Function = (res: SearchResponse): SearchResponse => res;

}
