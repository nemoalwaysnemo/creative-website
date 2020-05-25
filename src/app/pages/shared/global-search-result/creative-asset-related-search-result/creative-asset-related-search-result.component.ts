import { Component, Input, TemplateRef } from '@angular/core';
import { AdvanceSearch } from '@core/api';
import { SearchQueryParamsService } from '../../services/search-query-params.service';
import { BaseGlobalSearchResultComponent } from '../base-global-search-result.component';

@Component({
  selector: 'creative-asset-related-search-result',
  styleUrls: ['./creative-asset-related-search-result.component.scss'],
  templateUrl: './creative-asset-related-search-result.component.html',
})
export class CreativeAssetRelatedSearchResultComponent extends BaseGlobalSearchResultComponent {

  @Input() templateRef: TemplateRef<any>;

  @Input() hideEmpty: boolean = false;

  constructor(protected advanceSearch: AdvanceSearch, protected queryParamsService: SearchQueryParamsService) {
    super(advanceSearch, queryParamsService);
  }

}
