import { OnInit, OnDestroy } from '@angular/core';
import { DocumentModel, NuxeoPagination, AdvanceSearch, NuxeoRequestOptions, NuxeoPageProviderParams } from '@core/api';
import { tap, distinctUntilChanged, switchMap, map, filter } from 'rxjs/operators';
import { Observable, Subscription, of as observableOf } from 'rxjs';
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

  protected searchCurrentDocument(params: any = {}, opts?: NuxeoRequestOptions): Observable<DocumentModel> {
    return this.advanceSearch.request(Object.assign({}, this.getCurrentDocumentSearchParams(), params), opts)
      .pipe(
        map((res: NuxeoPagination) => res.entries.shift()),
        tap((doc: DocumentModel) => {
          this.loading = false;
          this.setCurrentDocument(doc);
        }),
      );
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

  protected parseCountry(list: string[]): string {
    return list.map((x) => x.split('/').pop()).join(', ');
  }

  protected requestTitleForIds(res: NuxeoPagination, properties: string[]): Observable<NuxeoPagination> {
    let ids = [];
    const listNew: any = {};
    properties.forEach((pro: string) => {
      res.entries.forEach((doc: DocumentModel) => {
        const hasProperties = doc.get(pro);
        if (hasProperties && hasProperties.length > 0) {
          if (typeof (hasProperties) === 'string') {
            ids.push(hasProperties);
          } else {
            ids = ids.concat(hasProperties);
          }
        }
      });
    });

    const distIds: string[] = Array.from(new Set(ids));
    if (distIds.length > 0) {
      const params = {
        ecm_uuid: `["${distIds.join('", "')}"]`,
      };

      return this.advanceSearch.request(new NuxeoPageProviderParams(params), new NuxeoRequestOptions({ schemas: ['The_Loupe_Main'] }))
        .pipe(
          map((response: NuxeoPagination) => {
            response.entries.forEach((resDoc: DocumentModel) => { listNew[resDoc.uid] = resDoc.title; });
            properties.forEach((pro: string) => {
              for (const doc of res.entries) {
                doc.properties[pro + '_title_'] = listNew[doc.get(pro)] ? listNew[doc.get(pro)] : null;
              }
            });
            return res;
          }),
        );
    }
    return observableOf(res);
  }

}
