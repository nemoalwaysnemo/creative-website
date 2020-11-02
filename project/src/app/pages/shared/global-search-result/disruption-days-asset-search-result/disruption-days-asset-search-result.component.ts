import { Component } from '@angular/core';
import { BaseSearchResultComponent } from '../base-search-result.component';
import { DocumentPageService } from '../../services/document-page.service';

@Component({
  selector: 'disruption-days-asset-search-result',
  styleUrls: ['../thumbnail-view.scss'],
  templateUrl: './disruption-days-asset-search-result.component.html',
})
export class DisruptionDaysAssetSearchResultComponent extends BaseSearchResultComponent {

  constructor(protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }

  protected onInit(): void {
    this.onQueryParamsChanged();
  }
}
