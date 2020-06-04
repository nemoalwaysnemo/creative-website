import { Component, Input, TemplateRef, Output, EventEmitter } from '@angular/core';
import { SearchResponse } from '@core/api/api.advance-search.service';
import { DocumentPageService } from '../../services/document-page.service';
import { BaseGlobalSearchResultComponent } from '../base-global-search-result.component';
import { GlobalSearchFormService } from '../../global-search-form/global-search-form.service';

@Component({
  selector: 'global-load-more-search-result',
  styleUrls: ['./global-load-more-search-result.component.scss'],
  templateUrl: './global-load-more-search-result.component.html',
})
export class GlobalLoadMoreSearchResultComponent extends BaseGlobalSearchResultComponent {

  @Input() templateRef: TemplateRef<any>;

  @Input() onSearchFilter: Function = (res: SearchResponse): boolean => res.source === 'document-related-info';

  @Output() onLoadMore: EventEmitter<SearchResponse> = new EventEmitter<SearchResponse>();

  constructor(
    protected documentPageService: DocumentPageService,
    protected globalSearchFormService: GlobalSearchFormService,
  ) {
    super(documentPageService, globalSearchFormService);
  }

  loadMore(): void {
    this.onLoadMore.emit(this.searchResponse);
  }

}
