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

  hiddeView: boolean = false;

  backgroudUrl: string = '';

  loadingStyle: any = {};

  layout: string = 'suggestion-inline';

  formSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    source: 'knowledge-search-form',
  });

  @Input() headline: string;

  @Input() subHead: string;

  @Input() redirectUrl: string;

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

  onKeyEnter(event: KeyboardEvent): void {
    this.redirectToListPage();
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  show(): void {
    this.hiddeView = false;
  }

  hide(): void {
    this.hiddeView = true;
  }

  getAssetUrl(doc: DocumentModel): string {
    return '';
  }

  private redirectToListPage(queryParams: any = {}): void {
    this.router.navigate([this.redirectUrl], { queryParamsHandling: 'merge', queryParams });
  }

  private isSearchManually(res: SearchResponse): boolean {
    return (res.searchParams.hasKeyword() || res.searchParams.hasFilters()) && res.metadata.event !== 'onSearchParamsInitialized';
  }

  protected onBeforeSearchEvent(res: SearchResponse): Observable<SearchResponse> {
    this.loadingStyle = this.isSearchManually(res) ? { 'min-height': '100px' } : {};
    return observableOf(res);
  }

  protected onAfterSearchEvent(res: SearchResponse): Observable<SearchResponse> {
    this.documents = this.isSearchManually(res) ? res.response.entries : [];
    this.show();
    return observableOf(res);
  }
}
