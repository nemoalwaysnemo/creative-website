import { Component } from '@angular/core';
import { BaseSearchResultComponent } from '../base-search-result.component';
import { SearchQueryParamsService } from '../../services/search-query-params.service';

@Component({
  selector: 'disruption-days-asset-search-result',
  styleUrls: ['../thumbnail-view.scss'],
  templateUrl: './disruption-days-asset-search-result.component.html',
})
export class DisruptionDaysAssetSearchResultComponent extends BaseSearchResultComponent {

  constructor(protected queryParamsService: SearchQueryParamsService) {
    super(queryParamsService);
  }

  protected onInit(): void {
    this.onQueryParamsChanged();
  }
}
