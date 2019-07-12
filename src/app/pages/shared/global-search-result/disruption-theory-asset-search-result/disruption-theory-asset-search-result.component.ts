import { Component, Input } from '@angular/core';
import { SearchResponse } from '@core/api';
import { Observable, of as observableOf } from 'rxjs';

@Component({
  selector: 'disruption-theory-asset-search-result',
  styleUrls: ['../thumbnail-view.scss'],
  templateUrl: './disruption-theory-asset-search-result.component.html',
})
export class DisruptionTheoryAssetSearchResultComponent {

  @Input() afterSearch: Function = (res: SearchResponse): Observable<SearchResponse> => observableOf(res);

}
