import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { isValueEmpty } from '@core/services/helpers';
import { DocumentModel, SearchResponse } from '@core/api';
import { Observable, of as observableOf, Subject } from 'rxjs';
import { DocumentPageService } from '../services/document-page.service';
import { BaseSearchFormComponent } from '../global-search-form/base-search-form.component';
import { GlobalSearchFormSettings } from '../global-search-form/global-search-form.interface';
import { GlobalSearchFormService } from '../global-search-form/global-search-form.service';
import { DocumentListViewItem } from '../document-list-view/document-list-view.interface';

@Component({
  selector: 'list-search-form-in-dialog',
  templateUrl: './list-search-form-in-dialog.component.html',
  styleUrls: ['../list-search-form/list-search-form.component.scss'],
})
export class ListSearchFormInDialogComponent extends BaseSearchFormComponent {

  layout: string = 'list-search-form';

  listViewOptions: any = {};

  items$: Subject<DocumentListViewItem[]> = new Subject<DocumentListViewItem[]>();

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    source: 'list-search-form-in-dialog',
  });

  @Input()
  set documents(docs: DocumentModel[]) {
    if (!isValueEmpty(docs)) {
      this.items$.next(this.listViewBuilder(docs));
    }
  }

  @Input() extendRowRef: TemplateRef<any>;

  @Input()
  set listViewSettings(settings: any) {
    if (!isValueEmpty(settings)) {
      this.listViewOptions = settings;
    }
  }

  @Output() onSelected: EventEmitter<any> = new EventEmitter<any>();

  @Input() listViewBuilder: (docs: DocumentModel[]) => DocumentListViewItem[] = (docs: DocumentModel[]) => docs.map((d: DocumentModel) => new DocumentListViewItem({
    uid: d.uid,
    title: d.title,
  }))

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

  protected onAfterSearchEvent(res: SearchResponse): Observable<SearchResponse> {
    this.items$.next(this.listViewBuilder(res.response.entries));
    return observableOf(res);
  }

}
