import { Component, Input, TemplateRef, Output, EventEmitter } from '@angular/core';
import { SearchResponse } from '@core/api/api.advance-search.service';
import { DocumentPageService } from '../services/document-page.service';
import { GlobalSearchFormService } from '../global-search-form/global-search-form.service';
import { BaseGlobalSearchResultComponent } from '../global-search-result/base-global-search-result.component';
import { SelectableItemSettings } from '../document-selectable';

@Component({
  selector: 'global-search-more-result-in-dialog',
  styleUrls: ['../global-search-more-result/global-search-more-result.component.scss'],
  templateUrl: '../global-search-more-result/global-search-more-result.component.html',
})
export class GlobalSearchMoreResultInDialogComponent extends BaseGlobalSearchResultComponent {

  constructor(
    protected documentPageService: DocumentPageService,
    protected globalSearchFormService: GlobalSearchFormService,
  ) {
    super(documentPageService, globalSearchFormService);
  }

  @Input() templateRef: TemplateRef<any>;

  @Input() selectableSettings: SelectableItemSettings;

  @Output() onLoadMore: EventEmitter<SearchResponse> = new EventEmitter<SearchResponse>();

  @Input() searchResultFilter: (res: SearchResponse) => boolean = (res: SearchResponse) => res.source === 'document-load-more-in-dialog';

  loadMore(): void {
    if (!this.loading) {
      this.onLoadMore.emit(this.searchResponse);
    }
  }

}
