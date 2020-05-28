import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of as observableOf } from 'rxjs';
import { DocumentModel, SearchResponse } from '@core/api';
import { SearchQueryParamsService } from '../services/search-query-params.service';
import { BaseSearchFormComponent } from '../global-search-form/base-search-form.component';
import { GlobalSearchFormSettings } from '../global-search-form/global-search-form.interface';
import { GlobalSearchFormService } from '../global-search-form/global-search-form.service';

@Component({
  selector: 'list-search-form',
  templateUrl: './list-search-form.component.html',
  styleUrls: ['./list-search-form.component.scss'],
})
export class ListSearchFormComponent extends BaseSearchFormComponent {

  documents: DocumentModel[] = [];

  layout: string = 'list-search-form';

  listViewOptions: any = {};

  formSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    source: 'list-search-form',
  });

  @Input()
  set listViewSettings(settings: any) {
    if (settings) {
      this.listViewOptions = settings;
    }
  }

  @Input() listViewBuilder: Function = (documents: DocumentModel[]): any[] => documents;

  @Output() onResponse = new EventEmitter<SearchResponse>();

  @Output() onSelected = new EventEmitter<SearchResponse>();

  constructor(
    protected router: Router,
    protected formBuilder: FormBuilder,
    protected queryParamsService: SearchQueryParamsService,
    protected globalSearchFormService: GlobalSearchFormService,
  ) {
    super(
      router,
      formBuilder,
      queryParamsService,
      globalSearchFormService,
    );
  }

  onRowSelect(data: any): void {

  }

  protected onAfterSearchEvent(res: SearchResponse): Observable<SearchResponse> {
    if (res.metadata.source === this.formSettings.source) {
      this.documents = this.listViewBuilder(res.response.entries);
    }
    return observableOf(res);
  }

}
