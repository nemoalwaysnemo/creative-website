import { Component } from '@angular/core';
import { AbstractSearchResultComponent } from '../abstract-search-result.component';

@Component({
  selector: 'disruption-theory-asset-search-result',
  styleUrls: ['../thumbnail-view.scss'],
  templateUrl: './disruption-theory-asset-search-result.component.html',
})
export class DisruptionTheoryAssetSearchResultComponent extends AbstractSearchResultComponent {

  protected onInit(): void {
    this.onQueryParamsChanged();
  }
}
