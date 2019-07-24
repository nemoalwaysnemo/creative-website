import { Component } from '@angular/core';
import { AbstractSearchResultComponent } from '../abstract-search-result.component';

@Component({
  selector: 'disruption-days-asset-search-result',
  styleUrls: ['../thumbnail-view.scss'],
  templateUrl: './disruption-days-asset-search-result.component.html',
})
export class DisruptionDaysAssetSearchResultComponent extends AbstractSearchResultComponent {

  protected onInit(): void {
    this.onQueryParamsChanged();
  }
}
