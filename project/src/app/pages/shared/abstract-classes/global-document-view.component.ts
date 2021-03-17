import { Component } from '@angular/core';
import { ActivatedRoute, NavigationExtras, ParamMap } from '@angular/router';
import { DocumentModel, NuxeoPagination, NuxeoRequestOptions, GlobalSearchParams, UserModel } from '@core/api';
import { isDocumentUID, vocabularyFormatter } from '@core/services/helpers';
import { combineLatest, Observable, of as observableOf } from 'rxjs';
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

  currentUser: UserModel;

  loading: boolean = true;

  enableInput: boolean = true;

  protected primaryKey: string = 'id';

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected documentPageService: DocumentPageService,
  ) {
    super(documentPageService);
  }

  onInit(): void {
    this.onPageInit();
    this.onParamsChanged();
  }

  onPageInit(): void {

  }

  onCallback(event: DocumentFormEvent): void {

  }

  protected setCurrentUser(user: UserModel): void {
    this.currentUser = user;
  }

  protected setCurrentDocument(doc: DocumentModel, user?: UserModel): void {
    super.setCurrentDocument(doc, user);
    if (user) { this.currentUser = user; }
    this.document = doc;
  }

  protected onInvalidDocumentUID(uid: string): void {
    this.redirectTo404();
  }

  protected getCurrentDocumentSearchParams(): any {
    return {};
  }

  protected getCurrentDocumentRequestParams(): NuxeoRequestOptions {
    return new NuxeoRequestOptions();
  }

  protected getCurrentUser(): void {
    const subscription = this.documentPageService.getCurrentUser().subscribe((user: UserModel) => {
      this.setCurrentUser(user);
    });
    this.subscription.add(subscription);
  }

  protected getDocumentModel(uid: string, params: any = {}, opts?: NuxeoRequestOptions): Observable<NuxeoPagination> {
    const searchParams = params instanceof GlobalSearchParams ? params.mergeParams({ ecm_uuid: `["${uid}"]` }) : new GlobalSearchParams(Object.assign({}, params, { ecm_uuid: `["${uid}"]` }));
    return this.documentPageService.advanceRequest(searchParams, opts);
  }

  protected getCurrentDocument(primaryKey: string, params: any = {}, opts?: NuxeoRequestOptions): Observable<DocumentModel> {
    return this.activatedRoute.paramMap
      .pipe(
        tap((paramMap: ParamMap) => {
          if (!isDocumentUID(paramMap.get(primaryKey))) {
            this.onInvalidDocumentUID(paramMap.get(primaryKey));
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
    return combineLatest([
      this.getTargetDocumentModel(params, opts),
      this.documentPageService.getCurrentUser(),
    ]).pipe(
      tap(([doc, user]: [DocumentModel, UserModel]) => {
        this.loading = false;
        this.setCurrentDocument(doc, user);
      }),
      map(([doc, user]: [DocumentModel, UserModel]) => doc),
    );
  }

  protected getTargetDocumentModel(params: any = {}, opts?: NuxeoRequestOptions): Observable<DocumentModel> {
    return this.documentPageService.advanceRequest(params, opts)
      .pipe(
        map((res: NuxeoPagination) => res.entries.shift()),
      );
  }

  protected onParamsChanged(): void {
    const subscription = combineLatest([
      this.getCurrentDocument(this.primaryKey, this.getCurrentDocumentSearchParams(), this.getCurrentDocumentRequestParams()),
      this.documentPageService.getCurrentUser(),
    ]).subscribe(([doc, user]: [DocumentModel, UserModel]) => {
      this.loading = false;
      this.setCurrentDocument(doc, user);
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

  protected vocabularyFormatter(list: string[]): string {
    return vocabularyFormatter(list);
  }

}
