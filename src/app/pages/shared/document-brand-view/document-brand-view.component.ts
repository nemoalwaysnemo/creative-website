import { Component, OnDestroy, OnInit } from '@angular/core';
import { AdvanceSearch } from '@core/api';
import { AbstractDocumentViewComponent } from '../abstract-classes/abstract-document-view.component';
import { SearchQueryParamsService } from '../services/search-query-params.service';

@Component({
  selector: 'tbwa-document-brand-view',
  styleUrls: ['./document-brand-view.component.scss'],
  templateUrl: './document-brand-view.component.html',
})
export class DocumentBrandViewComponent extends AbstractDocumentViewComponent implements OnInit, OnDestroy {

  constructor(
    protected advanceSearch: AdvanceSearch,
    protected queryParamsService: SearchQueryParamsService) {
    super(advanceSearch, queryParamsService);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.onDestroy();
  }

  protected getDefaultDocumentParams(): any {
    return {};
  }

}
