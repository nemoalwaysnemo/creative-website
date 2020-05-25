import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { GoogleAnalyticsService } from '@core/services';
import { DocumentModel, AdvanceSearch, SearchResponse } from '@core/api';
import { SearchQueryParamsService } from '../services/search-query-params.service';
import { BaseSearchFormComponent } from '../global-search-form/base-search-form.component';
import { GlobalSearchFormSettings } from '../global-search-form/global-search-form.interface';

@Component({
  selector: 'list-search-form',
  templateUrl: './list-search-form.component.html',
  styleUrls: ['./list-search-form.component.scss'],
})
export class ListSearchFormComponent extends BaseSearchFormComponent {

  documents: DocumentModel[] = [];

  layout: string = 'list-search-form';

  listViewOptions: any = {};

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings();

  @Input()
  set listViewSettings(settings: any) {
    if (settings) {
      this.listViewOptions = settings;
    }
  }

  @Input() listViewBuilder: Function = (documents: DocumentModel[]) => { };

  @Input()
  set formSettings(formSettings: GlobalSearchFormSettings) {
    if (formSettings) {
      this.searchFormSettings = formSettings;
    }
  }

  @Output() onResponse = new EventEmitter<SearchResponse>();

  constructor(
    protected router: Router,
    protected formBuilder: FormBuilder,
    protected advanceSearch: AdvanceSearch,
    protected googleAnalyticsService: GoogleAnalyticsService,
    protected queryParamsService: SearchQueryParamsService,
  ) {
    super(
      router,
      formBuilder,
      advanceSearch,
      queryParamsService,
      googleAnalyticsService,
    );
  }

  protected onAfterSearchEvent(res: SearchResponse): void {
    this.documents = this.listViewBuilder(res.response.entries);
  }

}
