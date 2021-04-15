import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { NbToastrService } from '@core/nebular/theme';
import { Observable, from, Subject, timer, BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, filter, pairwise, share, withLatestFrom } from 'rxjs/operators';
import { ActivatedRoute, Router, Params, NavigationExtras, ParamMap, NavigationEnd, RoutesRecognized } from '@angular/router';
import { DocumentModel, AdvanceSearchService, GlobalSearchParams, NuxeoRequestOptions, NuxeoPagination, UserService, UserModel, NuxeoResponse } from '@core/api';
import { CacheService, GoogleAnalyticsService } from '@core/services';
import { Environment } from '@environment/environment';

export class GlobalEvent {
  [key: string]: any;
  readonly name: string;
  readonly type: string;
  readonly data: any = {};

  constructor(data: any = {}) {
    Object.assign(this, data);
  }
}

@Injectable({
  providedIn: 'root',
})
export class DocumentPageService {

  previousRoutePath$ = new BehaviorSubject<string>(null);

  private document: DocumentModel; // it should be the doc for current page. every component linked to the route should set this

  private document$: Subject<DocumentModel> = new Subject<DocumentModel>();

  private event$: Subject<GlobalEvent> = new Subject<GlobalEvent>();

  constructor(
    private router: Router,
    private location: Location,
    private titleService: Title,
    private userService: UserService,
    private cacheService: CacheService,
    private toastrService: NbToastrService,
    private activatedRoute: ActivatedRoute,
    private advanceSearchService: AdvanceSearchService,
    private googleAnalyticsService: GoogleAnalyticsService,
  ) {
    this.subscribeRouteChanged();
  }

  onEvent(name?: string | string[]): Observable<GlobalEvent> {
    return this.event$.pipe(filter((e: GlobalEvent) => name ? (Array.isArray(name) ? name : [name]).includes(e.name) : true)).pipe(share());
  }

  onEventType(type?: string | string[]): Observable<GlobalEvent> {
    return this.event$.pipe(filter((e: GlobalEvent) => type ? (Array.isArray(type) ? type : [type]).includes(e.type) : true)).pipe(share());
  }

  triggerEvent(event: GlobalEvent): void {
    this.event$.next(event);
  }

  googleAnalyticsTrackTitle(): void {
    this.document$.pipe(
      withLatestFrom(
        this.router.events.pipe(
          distinctUntilChanged(),
          filter(event => event instanceof NavigationEnd),
        ),
      ),
    ).subscribe(([doc, event]: [DocumentModel, NavigationEnd]) => {
      const title = this.getPageTitle(doc, event);
      this.titleService.setTitle(title);
      this.googleAnalyticsService.trackPageView({ url: event.url, title, doc });
    });
  }

  googleAnalyticsTrackEvent(event: any): void {
    this.googleAnalyticsService.trackEvent(event);
  }

  googleAnalyticsTrackLink(doc: DocumentModel, category: string, type: string = '', title: string = ''): void {
    const action = type ? `${category} ${type}` : category;
    const label = title ? `${action} - ${doc.title} - ${title}` : `${action} - ${doc.title}`;
    this.googleAnalyticsTrackEvent({
      event_category: category,
      event_action: action,
      event_label: label,
      'dimensions.docId': doc.uid,
      'dimensions.docTitle': doc.title,
      'dimensions.docType': doc.type,
      'dimensions.userEvent': action,
    });
  }

  updateCurrentDocument(doc: DocumentModel): void {
    if (doc && this.document && doc.uid === this.document.uid) {
      this.document = doc;
    }
  }

  setCache(key: string, value: any): void {
    this.cacheService.set(key, value);
  }

  getCache(key: string, fallback?: Observable<any>, maxAge?: number): Observable<any> | Subject<any> {
    return this.cacheService.get(key, fallback);
  }

  setCurrentDocument(doc: DocumentModel): void {
    this.document = doc;
    this.document$.next(doc);
  }

  getCurrentDocument(): DocumentModel {
    return this.document;
  }

  getFavoriteDocument(): Observable<DocumentModel> {
    return this.userService.getFavoriteDocument();
  }

  addToFavorites(uids: string[]): Observable<NuxeoResponse> {
    return this.userService.addToFavorites(uids);
  }

  getSimplePreference(keys: string): Observable<NuxeoResponse> {
    return this.userService.getSimplePreference(keys);
  }

  setSimplePreference(properties: any): Observable<NuxeoResponse> {
    return this.userService.setSimplePreference(properties);
  }

  getCurrentUser(): Observable<UserModel> {
    return this.userService.getCurrentUser();
  }

  notify(message: string, title: string, status: string = 'info'): void {
    this.toastrService.show(message, title, { status });
  }

  operation(id: string, params: any = {}, input: string = null, opts: any = null): Observable<any> {
    return this.advanceSearchService.operation(id, params, input, opts);
  }

  advanceRequest(searchParams: GlobalSearchParams, opts?: NuxeoRequestOptions, provider?: string): Observable<NuxeoPagination> {
    return this.advanceSearchService.request(searchParams, opts, provider);
  }

  advanceRequestTitleByUIDs(res: NuxeoPagination, properties: string[]): Observable<NuxeoPagination> {
    return this.advanceSearchService.requestTitleByUIDs(res, properties);
  }

  changeQueryParams(queryParams: any = {}, state: any = {}, queryParamsHandling: 'merge' | 'preserve' | '' = '', skipLocationChange: boolean = false): Observable<boolean> {
    return from(this.navigate([], { relativeTo: this.activatedRoute, queryParams, queryParamsHandling, skipLocationChange, state }));
  }

  clearQueryParams(): void {
    this.changeQueryParams({});
  }

  getSnapshotQueryParams(): Params {
    return this.activatedRoute.snapshot.queryParams;
  }

  getSnapshotQueryParamMap(): ParamMap {
    return this.activatedRoute.snapshot.queryParamMap;
  }

  onQueryParamsChanged(): Observable<Params> {
    return this.activatedRoute.queryParams;
  }

  navigate(commands: any[], extras?: NavigationExtras): Promise<boolean> {
    return this.router.navigate(commands, extras);
  }

  redirect(link: string): Promise<boolean> {
    const url = decodeURI(link);
    return this.router.navigate(['/p/redirect'], { queryParams: { url }, skipLocationChange: true });
  }

  historyBack(): void {
    this.location.back();
  }

  redirectTo403(): void {
    this.router.navigate(['/p/error/403']);
  }

  redirectTo404(): void {
    this.router.navigate(['/p/error/404']);
  }

  openNewTab(url: string): void {
    window.open(url, '_blank');
  }

  refresh(delay: number = 0): void {
    timer(delay).subscribe(_ => {
      const queryParams = this.getSnapshotQueryParams();
      delete queryParams['currentPageIndex'];
      this.changeQueryParams(queryParams);
    });
  }

  isFirstVisitPage(): boolean {
    return this.previousRoutePath$.value === this.getCurrentUrl();
  }

  getCurrentUrl(): string {
    return this.router.url;
  }

  getCurrentFullUrl(): string {
    return window.location.href;
  }

  getCurrentAppUrl(moduleName: string): string {
    const url = this.getCurrentFullUrl().split('/p/').shift();
    return moduleName ? `${url}/p/${moduleName}` : url;
  }

  goToExternalLink(doc: DocumentModel): void {
    const url = doc.get('The_Loupe_Main:url');
    if (url) {
      this.openNewTab(url);
    } else {
      this.redirectTo404();
    }
  }

  private getPageTitle(doc: DocumentModel, event: NavigationEnd): string {
    const list: string[] = [];
    list.push(doc ? doc.title : '');
    list.push(this.getPagePrefixTitle(event));
    list.push(Environment.baseTitle);
    return list.filter((x: string) => x.trim()).join(' - ');
  }

  private getPagePrefixTitle(event: NavigationEnd): string {
    const list = event.url.split('/p/').pop().split('/');
    const title = list.shift().split('?').shift();
    return title.charAt(0).toUpperCase() + title.substring(1);
  }

  private subscribeRouteChanged(): void {
    // ..initial prvious route will be the current path for now
    this.previousRoutePath$.next(this.location.path());
    // on every route change take the two events of two routes changed(using pairwise)
    // and save the old one in a behavious subject to access it in another component
    // we can use if another component like intro-advertise need the previous route
    // because he need to redirect the user to where he did came from.
    this.router.events.pipe(
      filter(e => e instanceof RoutesRecognized),
      pairwise(),
    ).subscribe((event: any[]) => {
      this.previousRoutePath$.next(event[0].urlAfterRedirects);
    });
  }

}
