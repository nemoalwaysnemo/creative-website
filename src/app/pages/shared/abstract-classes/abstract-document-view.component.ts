import { OnInit, OnDestroy } from '@angular/core';
import { DocumentModel, NuxeoPagination, AdvanceSearch } from '@core/api';
import { tap, distinctUntilChanged, switchMap, map, filter } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { isDocumentUID } from '@core/services';
import { SearchQueryParamsService } from '../services/search-query-params.service';
import { ActivatedRoute } from '@angular/router';

export abstract class AbstractDocumentViewComponent implements OnInit, OnDestroy {

  document: DocumentModel;

  loading: boolean = true;

  protected primaryKey: string = 'id';

  protected subscription: Subscription = new Subscription();

  constructor(
    protected advanceSearch: AdvanceSearch,
    protected activatedRoute: ActivatedRoute,
    protected queryParamsService: SearchQueryParamsService,
  ) {
  }

  onInit() {
    this.onQueryParamsChanged();
  }

  onDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.onInit();
  }

  ngOnDestroy(): void {
    this.onDestroy();
  }

  protected setCurrentDocument(doc: DocumentModel): void {
    this.document = doc;
  }

  protected onInvalidDocumentUID(uid: string): void {
    this.redirectTo404();
  }

  protected abstract getDefaultDocumentParams(): object;

  protected getDocumentModel(uid: string, params: any = {}): Observable<NuxeoPagination> {
    return this.advanceSearch.request(Object.assign({}, params, { ecm_uuid: `["${uid}"]` }));
  }

  protected getDefaultDocument(primaryKey: string, params: any = {}): Observable<DocumentModel> {
    return this.activatedRoute.queryParams
      .pipe(
        tap(queryParams => {
          if (!isDocumentUID(queryParams[primaryKey])) {
            this.onInvalidDocumentUID(queryParams[primaryKey]);
          }
        }),
        filter(queryParams => !this.document && isDocumentUID(queryParams[primaryKey])),
        distinctUntilChanged(),
        switchMap(queryParams => this.getDocumentModel(queryParams[primaryKey], params)),
        map((res: NuxeoPagination) => res.entries.shift()),
      );
  }

  protected onQueryParamsChanged(): void {
    const subscription = this.getDefaultDocument(this.primaryKey, this.getDefaultDocumentParams())
      .subscribe((doc: DocumentModel) => {
        this.loading = false;
        this.setCurrentDocument(doc);
      });
    this.subscription.add(subscription);
  }

  protected redirectTo404(): void {
    this.queryParamsService.redirectTo404();
  }
}
