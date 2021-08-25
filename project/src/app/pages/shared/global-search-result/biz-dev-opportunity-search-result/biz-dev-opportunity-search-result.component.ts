import { Component, Input } from '@angular/core';
import { BaseSearchResultComponent } from '../base-search-result.component';
import { DocumentPageService } from '../../services/document-page.service';

@Component({
  selector: 'biz-dev-opportunity-search-result',
  styleUrls: ['../thumbnail-view.scss'],
  templateUrl: './biz-dev-opportunity-search-result.component.html',
})
export class BizDevOpportunitySearchResultComponent extends BaseSearchResultComponent {

  @Input() folderId: string;

  constructor(protected documentPageService: DocumentPageService,
  ) {
    super(documentPageService);
  }
  protected onInit(): void {
    this.onQueryParamsChanged();
  }
}
