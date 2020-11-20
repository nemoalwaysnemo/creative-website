import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { NbToastrService } from '@core/nebular/theme';
import { Observable, from, Subject, timer, BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, filter, pairwise, withLatestFrom } from 'rxjs/operators';
import { ActivatedRoute, Router, Params, NavigationExtras, ParamMap, NavigationEnd, RoutesRecognized } from '@angular/router';
import { DocumentModel, AdvanceSearchService, GlobalSearchParams, NuxeoRequestOptions, NuxeoPagination, UserService, UserModel, NuxeoResponse } from '@core/api';
import { GoogleAnalyticsService } from '@core/services';
import { Environment } from '@environment/environment';

@Injectable({
  providedIn: 'root',
})
export class DocumentPageService {

  previousRoutePath$ = new BehaviorSubject<string>(null);

  private document: DocumentModel; // it should be the doc for current page. every component linked to the route should set this

  private document$: Subject<DocumentModel> = new Subject<DocumentModel>();

  constructor(
    private router: Router,
    private location: Location,
    private titleService: Title,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private toastrService: NbToastrService,
    private advanceSearchService: AdvanceSearchService,
    private googleAnalyticsService: GoogleAnalyticsService,
  ) {
    this.subscribeRouteChanged();
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

  updateCurrentDocument(doc: DocumentModel): void {
    if (doc && this.document && doc.uid === this.document.uid) {
      this.document = doc;
    }
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
