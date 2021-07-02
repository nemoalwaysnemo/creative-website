import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of as observableOf } from 'rxjs';
import { DocumentModel, SearchResponse } from '@core/api';
import { DocumentPageService } from '../services/document-page.service';
import { BaseSearchFormComponent } from '../global-search-form/base-search-form.component';
import { GlobalSearchFormSettings } from '../global-search-form/global-search-form.interface';
import { GlobalSearchFormService } from '../global-search-form/global-search-form.service';
import { DocumentListViewItem } from '../document-list-view/document-list-view.interface';

@Component({
  selector: 'list-search-form',
  templateUrl: './list-search-form.component.html',
  styleUrls: ['./list-search-form.component.scss'],
})
export class ListSearchFormComponent extends BaseSearchFormComponent {

  items: DocumentListViewItem[] = [];

  layout: string = 'list-search-form';

  listViewOptions: any = {};

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    source: 'list-search-form',
  });

  @Input() extendRowRef: TemplateRef<any>;

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

  @Output() onSelected: EventEmitter<any> = new EventEmitter<any>();

  @Input() listViewBuilder: (docs: DocumentModel[]) => DocumentListViewItem[] = (docs: DocumentModel[]) => docs.map((d: DocumentModel) => new DocumentListViewItem({
    uid: d.uid,
    title: d.title,
  }))

  onRowSelect(item: any): void {
    this.onSelected.emit(item);
  }

  protected onAfterSearchEvent(res: SearchResponse): Observable<SearchResponse> {
    this.items = this.listViewBuilder(res.response.entries);
    return observableOf(res);
  }

}
