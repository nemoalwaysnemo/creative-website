import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdvanceSearch } from '@core/api';
import { AbstractDocumentViewComponent } from '../abstract-classes/abstract-document-view.component';
import { SearchQueryParamsService } from '../services/search-query-params.service';

@Component({
  selector: 'document-brand-view',
  styleUrls: ['../../../theme/styles/document-metadata-view.scss'],
  templateUrl: './document-brand-view.component.html',
})
export class DocumentBrandViewComponent extends AbstractDocumentViewComponent {

  constructor(
    protected advanceSearch: AdvanceSearch,
    protected activatedRoute: ActivatedRoute,
    protected queryParamsService: SearchQueryParamsService) {
    super(advanceSearch, activatedRoute, queryParamsService);
  }

  protected getCurrentDocumentSearchParams(): any {
    return {};
  }

}
