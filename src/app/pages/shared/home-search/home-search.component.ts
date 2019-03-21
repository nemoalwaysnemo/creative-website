import { OnInit, Component, OnDestroy, Input } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { debounceTime, map, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { NuxeoPagination, DocumentModel, AdvanceSearch } from '@core/api';
import { NUXEO_META_INFO } from '@environment/environment';

@Component({
  selector: 'tbwa-home-search',
  templateUrl: './home-search.component.html',
  styleUrls: ['./home-search.component.scss'],
})

export class HomeSearchComponent implements OnInit, OnDestroy {

  results: DocumentModel[];

  documents: DocumentModel[] = [];

  queryField: FormControl = new FormControl();

  layout: string = 'search-list';

  backgroudUrl: string = '';

  searchForm: FormGroup;

  showFilter: boolean = false;

  private subscription: Subscription = new Subscription();

  private params: any = {
    pageSize: 10,
    ecm_primaryType: NUXEO_META_INFO.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES,
  };

  @Input() headline: string;
  @Input() subHead: string;
  @Input() placeholder: string;
  @Input()
  set backgroudDocument(doc: DocumentModel) {
    if (doc) {
      this.backgroudUrl = doc.thumbnailUrl;
    }
  }

  constructor(
    private formBuilder: FormBuilder,
    private advanceSearch: AdvanceSearch,
    private router: Router,
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
        switchMap((query: string) => this.advanceSearch.searchForText(query, this.params)),
      )
      .subscribe((result: NuxeoPagination) => {
        this.results = result.entries;
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

  private buildQueryParams(): any {
    return { q: this.queryField.value };
  }

  private createForm() {
    this.searchForm = this.formBuilder.group(this.params);
  }

  private redirectToListPage(queryParams: {}) {
    this.router.navigate(['/p/creative/search'], { queryParamsHandling: 'merge', queryParams });
  }

}
