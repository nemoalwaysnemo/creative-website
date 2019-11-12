import { Component } from '@angular/core';
import { AdvanceSearch } from '@core/api';
import { ActivatedRoute } from '@angular/router';
import { AbstractDocumentManageComponent, SearchQueryParamsService } from '@pages/shared';

@Component({
  selector: 'folder-manage',
  styleUrls: ['./folder-manage.component.scss'],
  templateUrl: './folder-manage.component.html',
})
export class FolderManageComponent extends AbstractDocumentManageComponent {

  constructor(
    protected advanceSearch: AdvanceSearch,
    protected activatedRoute: ActivatedRoute,
    protected queryParamsService: SearchQueryParamsService) {
    super(advanceSearch, activatedRoute, queryParamsService);
  }

}
