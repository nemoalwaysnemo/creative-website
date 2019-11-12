import { Component } from '@angular/core';
import { AdvanceSearch } from '@core/api';
import { ActivatedRoute } from '@angular/router';
import { AbstractDocumentManageComponent, SearchQueryParamsService } from '@pages/shared';

@Component({
  selector: 'library-manage',
  styleUrls: ['./library-manage.component.scss'],
  templateUrl: './library-manage.component.html',
})
export class LibraryManageComponent extends AbstractDocumentManageComponent {

  constructor(
    protected advanceSearch: AdvanceSearch,
    protected activatedRoute: ActivatedRoute,
    protected queryParamsService: SearchQueryParamsService) {
    super(advanceSearch, activatedRoute, queryParamsService);
  }

}
