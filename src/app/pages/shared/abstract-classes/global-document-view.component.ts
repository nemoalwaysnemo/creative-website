import { Component } from '@angular/core';
import { ActivatedRoute, NavigationExtras, ParamMap } from '@angular/router';
import { DocumentModel, NuxeoPagination, AdvanceSearchService, NuxeoRequestOptions } from '@core/api';
import { isDocumentUID, parseCountry } from '@core/services/helpers';
import { Observable, of as observableOf } from 'rxjs';
import { tap, distinctUntilChanged, concatMap, map, filter } from 'rxjs/operators';
import { DocumentFormEvent } from '../document-form/document-form.interface';
import { DocumentPageService } from '../services/document-page.service';
import { BaseDocumentViewComponent } from './base-document-view.component';
import { Environment } from '@environment/environment';

@Component({
  template: '',
})
export class GlobalDocumentViewComponent extends BaseDocumentViewComponent {

  document: DocumentModel;

  loading: boolean = true;

  showInput: boolean = true;

  protected primaryKey: string = 'id';

  constructor(
    protected advanceSearchService: AdvanceSearchService,
    protected activatedRoute: ActivatedRoute,
    protected documentPageService: DocumentPageService,
  ) {
    super(documentPageService);
  }

  onInit(): void {
    this.onParamsChanged();
  }

  onDestroy(): void {
    this.subscription.unsubscribe();
  }

  assetPath(src: string): string {
    return Environment.assetPath + src;
  }

  onCallback(callback: DocumentFormEvent): void {

  }

  protected setCurrentDocument(doc: DocumentModel): void {
    super.setCurrentDocument(doc);
    this.document = doc;
  }

  protected onInvalidDocumentUID(uid: string): void {
    this.redirectTo404();
  }

  protected getCurrentDocumentSearchParams(): object {
    return {};
  }

  protected getCurrentDocumentRequestParams(): NuxeoRequestOptions {
    return null;
  }

  protected getDocumentModel(uid: string, params: any = {}, opts?: NuxeoRequestOptions): Observable<NuxeoPagination> {
    return this.advanceSearchService.request(Object.assign({}, params, { ecm_uuid: `["${uid}"]` }), opts);
  }

  protected getCurrentDocument(primaryKey: string, params: any = {}, opts?: NuxeoRequestOptions): Observable<DocumentModel> {
    return this.activatedRoute.paramMap
      .pipe(
        tap((paramMap: ParamMap) => {
          if (!isDocumentUID(paramMap.get(primaryKey))) {
            this.onInvalidDocumentUID(paramMap.get(primaryKey));
            return false;
          }
        }),
        filter((paramMap: ParamMap) => (!this.document || this.document.uid !== paramMap.get(primaryKey)) && isDocumentUID(paramMap.get(primaryKey))),
        distinctUntilChanged(),
        concatMap((paramMap: ParamMap) => {
          const doc: DocumentModel = this.documentPageService.getCurrentDocument();
          return doc && doc.uid === paramMap.get(primaryKey) ? observableOf(doc) : this.getDocumentModel(paramMap.get(primaryKey), params, opts).pipe(
            map((res: NuxeoPagination) => res.entries.shift()),
          );
        }),
      );
  }

  protected searchCurrentDocument(params: any = {}, opts?: NuxeoRequestOptions): Observable<DocumentModel> {
    return this.getTargetDocumentModel(params, opts).pipe(
      tap((doc: DocumentModel) => {
        this.loading = false;
        this.setCurrentDocument(doc);
      }),
    );
  }

  protected getTargetDocumentModel(params: any = {}, opts?: NuxeoRequestOptions): Observable<DocumentModel> {
    return this.advanceSearchService.request(params, opts)
      .pipe(
        map((res: NuxeoPagination) => res.entries.shift()),
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

  protected refresh(redirectUrl?: string): void {
    if (redirectUrl) {
      this.documentPageService.redirect(redirectUrl);
    } else {
      this.documentPageService.refresh();
    }
  }

  protected redirectTo404(): void {
    this.documentPageService.redirectTo404();
  }

  protected navigate(commands: any[], extras?: NavigationExtras): Promise<boolean> {
    return this.documentPageService.navigate(commands, extras);
  }

  protected parseCountry(list: string[]): string {
    return parseCountry(list);
  }

}
