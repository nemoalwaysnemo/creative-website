import { Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of as observableOf } from 'rxjs';
import { DocumentModel, SearchResponse } from '@core/api';
import { DocumentPageService } from '../services/document-page.service';
import { BaseSearchFormComponent } from '../global-search-form/base-search-form.component';
import { GlobalSearchFormSettings } from '../global-search-form/global-search-form.interface';
import { GlobalSearchFormService } from '../global-search-form/global-search-form.service';

@Component({
  selector: 'knowledge-search-form',
  templateUrl: './knowledge-search-form.component.html',
  styleUrls: ['./knowledge-search-form.component.scss'],
})

export class KnowledgeSearchFormComponent extends BaseSearchFormComponent {

  documents: DocumentModel[] = [];

  backgroudUrl: string = '';

  layout: string = 'suggestion-inline';

  formSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    source: 'knowledge-search-form',
  });

  @Input() headline: string;

  @Input() subHead: string;

  @Input() redirectUrl: string;

  private preventDocHide: boolean = false;

  private isInitialSearch: boolean = true;

  private results: DocumentModel[] = [];

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

  show(): void {
    this.documents = this.isInitialSearch ? this.documents = [] : this.results;
  }

  hide(): void {
    if (!this.preventDocHide) {
      this.documents = [];
    }
    this.preventDocHide = false;
  }

  onKeyEnter(event: KeyboardEvent): void {
    this.redirectToListPage();
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  preventHide(pre: boolean): void {
    this.preventDocHide = pre;
  }

  toggleFilter(): void {
    super.toggleFilter();
    this.preventDocHide = true;
  }

  getAssetUrl(doc: DocumentModel): string {
    return '';
  }

  private redirectToListPage(queryParams: any = {}): void {
    this.router.navigate([this.redirectUrl], { queryParamsHandling: 'merge', queryParams });
  }

  protected onAfterSearchEvent(res: SearchResponse): Observable<SearchResponse> {
    this.results = res.response.entries;
    const searchText = res.searchParams.ecm_fulltext;
    const searchFilter = res.searchParams.hasFilters();
    this.isInitialSearch = !(searchText || searchFilter);
    this.isInitialSearch ? this.hide() : this.show();
    return observableOf(res);
  }
}
