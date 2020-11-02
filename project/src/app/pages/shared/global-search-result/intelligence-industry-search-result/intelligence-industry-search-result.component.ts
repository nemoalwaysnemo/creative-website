import { Component } from '@angular/core';
import { BaseSearchResultComponent } from '../base-search-result.component';
import { DocumentPageService } from '../../services/document-page.service';

@Component({
  selector: 'intelligence-industry-search-result',
  styleUrls: ['../thumbnail-view.scss'],
  templateUrl: './intelligence-industry-search-result.component.html',
})
export class IntelligenceIndustrySearchResultComponent extends BaseSearchResultComponent {

  constructor(protected documentPageService: DocumentPageService) {
    super(documentPageService);
  }

  protected onInit(): void {
    this.onQueryParamsChanged();
  }
}
