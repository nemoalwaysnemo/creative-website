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
  selector: 'list-search-form-in-dialog',
  templateUrl: './list-search-form-in-dialog.component.html',
  styleUrls: ['../list-search-form/list-search-form.component.scss'],
})
export class ListSearchFormInDialogComponent extends BaseSearchFormComponent {

  @Input()
  set listViewSettings(settings: any) {
    if (settings) {
      this.listViewOptions = settings;
    }
  }

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

  documents: DocumentModel[] = [];

  layout: string = 'list-search-form';

  listViewOptions: any = {};

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    source: 'list-search-form',
  });

  @Output() onSelected: EventEmitter<any> = new EventEmitter<any>();

  @Input() listViewBuilder: (documents: DocumentModel[]) => any[] = (documents: DocumentModel[]) => documents;

  onRowSelect(item: any): void {
    this.onSelected.emit(item);
  }

  protected onAfterSearchEvent(res: SearchResponse): Observable<SearchResponse> {
    this.documents = this.listViewBuilder(res.response.entries);
    return observableOf(res);
  }

}
