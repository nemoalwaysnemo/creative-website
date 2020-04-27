import { Component, Input } from '@angular/core';
import { AbstractSearchResultComponent } from '../abstract-search-result.component';
import { SearchQueryParamsService } from '../../services/search-query-params.service';

@Component({
  selector: 'biz-dev-case-study-asset-search-result',
  styleUrls: ['../thumbnail-view.scss'],
  templateUrl: './biz-dev-case-study-asset-search-result.component.html',
})
export class BizDevCaseStudyAssetSearchResultComponent extends AbstractSearchResultComponent {

  @Input() folderId: string;
  constructor(protected queryParamsService: SearchQueryParamsService) {
    super(queryParamsService);
  }

  protected onInit(): void {
    this.onQueryParamsChanged();
  }
}
