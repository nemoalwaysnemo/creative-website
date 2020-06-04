import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of as observableOf } from 'rxjs';
import { DocumentModel, SearchResponse } from '@core/api';
import { DocumentPageService } from '../services/document-page.service';
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

  @Output() onResponse: EventEmitter<SearchResponse> = new EventEmitter<SearchResponse>();

  @Output() onSelected: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    protected router: Router,
    protected formBuilder: FormBuilder,
    protected documentPageService: DocumentPageService,
    protected globalSearchFormService: GlobalSearchFormService,
  ) {
    super(
      router,
      formBuilder,
      documentPageService,
      globalSearchFormService,
    );
  }

  onRowSelect(item: any): void {
    this.onSelected.emit(item);
  }

  protected onAfterSearchEvent(res: SearchResponse): Observable<SearchResponse> {
    this.documents = this.listViewBuilder(res.response.entries);
    this.onResponse.emit(res);
    return observableOf(res);
  }

}
