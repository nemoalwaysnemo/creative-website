import { OnInit, Component, OnDestroy, Input } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { NuxeoPagination, DocumentModel, AdvanceSearch } from '@core/api';
import { GoogleAnalyticsService } from '@core/google-analytics';

@Component({
  selector: 'home-search-form',
  templateUrl: './home-search-form.component.html',
  styleUrls: ['./home-search-form.component.scss'],
})

export class HomeSearchFormComponent implements OnInit, OnDestroy {

  results: DocumentModel[];

  documents: DocumentModel[] = [];

  queryField: FormControl = new FormControl();

  backgroudUrl: string = '';

  layout: string = 'suggestion-inline';

  searchForm: FormGroup;

  showFilter: boolean = false;

  loading: boolean = false;

  @Input() params: any;

  @Input() headline: string;

  @Input() subHead: string;

  @Input() placeholder: string;

  @Input() assetUrl: string;

  @Input() redirectUrl: string;

  pageRedirect: string;

  @Input()
  set backgroudDocument(doc: DocumentModel) {
    if (doc) {
      this.backgroudUrl = doc.thumbnailUrl;
    }
  }

  private subscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private advanceSearch: AdvanceSearch,
    private googleAnalyticsService: GoogleAnalyticsService,
  ) { }

  ngOnInit() {
    this.createForm();
    this.onSearch();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSearch(): void {
    const subscription = this.queryField.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap(_ => {
          this.googleAnalyticsService.searchTrack({ 'event_category': 'Search', 'event_action': 'HomeQuickSearch', 'event_label': 'HomeQuickSearch' });
        }),
        switchMap((query: string) => this.advanceSearch.searchForText(query, this.params)),
      )
      .subscribe((result: NuxeoPagination) => {
        this.results = result.entries;
        this.pageRedirect = this.params.ecm_fulltext;
        this.show();
      });
    this.subscription.add(subscription);
  }

  show(): void {
    this.documents = this.results;
  }

  hide(): void {
    this.documents = [];
  }

  onKeyup(event: KeyboardEvent) {
    const params = this.buildQueryParams();
    this.redirectToListPage(params);
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  isThinkingPath(path) {
    return path.includes('/Disruption/Brilliant Thinking');
  }

  isDaysPath(path) {
    return path.includes('/Disruption/Disruption Days');
  }

  resultRedirectUrl(doc) {
    if ( doc.type === 'App-Disruption-Roadmap-Asset' ) {
      return '#/p/disruption/Disruption Roadmaps?q=' + this.pageRedirect;
    } else if ( doc.type === 'App-Disruption-Theory-Asset'  ) {
      return '#//p/disruption/Disruption Theory?q=' + this.pageRedirect;
    } else if ( doc.type === 'App-Disruption-Asset' && this.isThinkingPath(doc.path) ) {
      return '#/p/disruption/Brilliant Thinking?q=' + this.pageRedirect;
    } else if ( doc.type === 'App-Disruption-Asset' && this.isDaysPath(doc.path) ) {
      return '#/p/disruption/days/asset/' + doc.uid;
    } else {
      return '#/' + this.assetUrl + '/' + doc.uid;
    }
  }

  private buildQueryParams(): any {
    return { q: this.queryField.value };
  }

  private createForm() {
    this.searchForm = this.formBuilder.group(this.params);
  }

  private redirectToListPage(queryParams: {}) {
    this.router.navigate([this.redirectUrl], { queryParamsHandling: 'merge', queryParams });
  }

}
