import { OnInit, OnDestroy } from '@angular/core';
import { DocumentModel, NuxeoPagination, AdvanceSearch, NuxeoRequestOptions } from '@core/api';
import { tap, distinctUntilChanged, switchMap, map, filter } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { isDocumentUID } from '@core/services';
import { SearchQueryParamsService } from '../services/search-query-params.service';
import { ActivatedRoute, NavigationExtras } from '@angular/router';

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
    this.onParamsChanged();
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

  protected abstract getCurrentDocumentSearchParams(): object;

  protected getCurrentDocumentRequestParams(): NuxeoRequestOptions {
    return null;
  }

  protected getDocumentModel(uid: string, params: any = {}, opts?: NuxeoRequestOptions): Observable<NuxeoPagination> {
    return this.advanceSearch.request(Object.assign({}, params, { ecm_uuid: `["${uid}"]` }), opts);
  }

  protected getCurrentDocument(primaryKey: string, params: any = {}, opts?: NuxeoRequestOptions): Observable<DocumentModel> {
    return this.activatedRoute.paramMap
      .pipe(
        tap(paramMap => {
          if (!isDocumentUID(paramMap.get(primaryKey))) {
            this.onInvalidDocumentUID(paramMap.get(primaryKey));
          }
        }),
        filter(paramMap => (!this.document || this.document.uid !== paramMap.get(primaryKey)) && isDocumentUID(paramMap.get(primaryKey))),
        distinctUntilChanged(),
        switchMap(paramMap => this.getDocumentModel(paramMap.get(primaryKey), params, opts)),
        map((res: NuxeoPagination) => res.entries.shift()),
      );
  }

  protected searchCurrentDocument(params: any = {}, opts?: NuxeoRequestOptions): void {
    const subscription = this.advanceSearch.request(Object.assign({}, this.getCurrentDocumentSearchParams(), params), opts)
      .pipe(
        map((res: NuxeoPagination) => res.entries.shift()),
      ).subscribe((doc: DocumentModel) => {
        this.loading = false;
        this.setCurrentDocument(doc);
      });
    this.subscription.add(subscription);
  }

  protected onParamsChanged(): void {
    const subscription = this.getCurrentDocument(this.primaryKey, this.getCurrentDocumentSearchParams(), this.getCurrentDocumentRequestParams())
      .subscribe((doc: DocumentModel) => {
        this.loading = false;
        this.setCurrentDocument(doc);
      });
    this.subscription.add(subscription);
  }

  protected refresh(): void {
    this.queryParamsService.changeQueryParams({ refresh: true }, { type: 'refresh' }, 'merge');
  }

  protected redirectTo404(): void {
    this.queryParamsService.redirectTo404();
  }

  protected navigate(commands: any[], extras?: NavigationExtras): Promise<boolean> {
    return this.queryParamsService.navigate(commands, extras);
  }

}
