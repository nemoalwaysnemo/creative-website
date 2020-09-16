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

  constructor(
    protected documentPageService: DocumentPageService,
    protected globalSearchFormService: GlobalSearchFormService,
  ) {
    super(documentPageService, globalSearchFormService);
  }

  @Input() templateRef: TemplateRef<any>;

  @Output() onLoadMore: EventEmitter<SearchResponse> = new EventEmitter<SearchResponse>();

  @Input() searchResultFilter: Function = (res: SearchResponse): boolean => res.source === 'document-load-more';

  loadMore(): void {
    if (!this.loading) {
      this.onLoadMore.emit(this.searchResponse);
    }
  }

}
