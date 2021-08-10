import { Component, Input, TemplateRef, Output, EventEmitter } from '@angular/core';
import { SearchResponse } from '@core/api/api.advance-search.service';
import { DocumentPageService } from '../services/document-page.service';
import { GlobalSearchFormService } from '../global-search-form/global-search-form.service';
import { BaseGlobalSearchResultComponent } from '../global-search-result/base-global-search-result.component';
import { DocumentThumbnailViewSettings } from '../document-thumbnail-view';
import { SelectableItemSettings } from '../document-selectable';

@Component({
  selector: 'global-search-more-result',
  styleUrls: ['./global-search-more-result.component.scss'],
  templateUrl: './global-search-more-result.component.html',
})
export class GlobalSearchMoreResultComponent extends BaseGlobalSearchResultComponent {

  constructor(
    protected documentPageService: DocumentPageService,
    protected globalSearchFormService: GlobalSearchFormService,
  ) {
    super(documentPageService, globalSearchFormService);
  }

  @Input() templateRef: TemplateRef<any>;

  @Output() loadMore: EventEmitter<SearchResponse> = new EventEmitter<SearchResponse>();

  @Input() selectableSettings: SelectableItemSettings;

  @Input() searchResultFilter: (res: SearchResponse) => boolean = (res: SearchResponse) => res.source === 'document-load-more';

  loadMoreData(): void {
    if (!this.loading) {
      this.loadMore.emit(this.searchResponse);
    }
  }

  protected getDefaultThumbnailViewSettings(): any {
    return {
      layout: 'my_agency dates full-width',
    };
  }

}
