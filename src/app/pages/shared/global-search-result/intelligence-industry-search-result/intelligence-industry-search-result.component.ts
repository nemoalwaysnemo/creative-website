import { Component, Input } from '@angular/core';
import { SearchResponse } from '@core/api';
import { Observable, of as observableOf } from 'rxjs';
import { AbstractSearchResultComponent } from '../abstract-search-result.component';

@Component({
  selector: 'intelligence-industry-search-result',
  styleUrls: ['../thumbnail-view.scss'],
  templateUrl: './intelligence-industry-search-result.component.html',
})
export class IntelligenceIndustrySearchResultComponent extends AbstractSearchResultComponent {

  @Input() folderId: string;

  @Input() afterSearch: Function = (res: SearchResponse): Observable<SearchResponse> => observableOf(res);

  protected onInit(): void {
    this.onQueryParamsChanged();
  }
}
