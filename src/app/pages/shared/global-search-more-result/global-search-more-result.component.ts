import { Component, Input, TemplateRef, Output, EventEmitter } from '@angular/core';
import { SearchResponse } from '@core/api/api.advance-search.service';
import { DocumentPageService } from '../services/document-page.service';
import { GlobalSearchFormService } from '../global-search-form/global-search-form.service';
import { BaseGlobalSearchResultComponent } from '../global-search-result/base-global-search-result.component';

@Component({
  selector: 'global-search-more-result',
  styleUrls: ['./global-search-more-result.component.scss'],
  templateUrl: './global-search-more-result.component.html',
})
export class GlobalSearchMoreResultComponent extends BaseGlobalSearchResultComponent {

  @Input() templateRef: TemplateRef<any>;

  @Input() searchResultFilter: Function = (res: SearchResponse): boolean => res.source === 'document-load-more';

  @Output() onLoadMore: EventEmitter<SearchResponse> = new EventEmitter<SearchResponse>();

  constructor(
    protected documentPageService: DocumentPageService,
    protected globalSearchFormService: GlobalSearchFormService,
  ) {
    super(documentPageService, globalSearchFormService);
  }

  loadMore(): void {
    if (!this.loading) {
      this.onLoadMore.emit(this.searchResponse);
    }
  }

}
