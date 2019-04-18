import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
    protected activatedRoute: ActivatedRoute,
    protected queryParamsService: SearchQueryParamsService) {
    super(advanceSearch, activatedRoute, queryParamsService);
  }

  protected getDefaultDocumentParams(): any {
    return {};
  }

}
