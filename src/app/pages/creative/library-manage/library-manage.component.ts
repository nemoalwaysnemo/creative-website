import { Component } from '@angular/core';
import { AdvanceSearch } from '@core/api';
import { ActivatedRoute } from '@angular/router';
import { TAB_CONFIG } from '../creative-tab-config';
import { AbstractDocumentManageComponent, SearchQueryParamsService } from '@pages/shared';

@Component({
  selector: 'library-manage',
  styleUrls: ['./library-manage.component.scss'],
  templateUrl: './library-manage.component.html',
})
export class LibraryManageComponent extends AbstractDocumentManageComponent {

  protected tabConfig: any[] = TAB_CONFIG;

  constructor(
    protected advanceSearch: AdvanceSearch,
    protected activatedRoute: ActivatedRoute,
    protected queryParamsService: SearchQueryParamsService) {
    super(advanceSearch, activatedRoute, queryParamsService);
  }

  protected getSettings(): any[] {
    return [];
  }

  protected getFormLayout(): any {
    return [];
  }

}
