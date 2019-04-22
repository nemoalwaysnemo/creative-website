import { OnInit, Component, OnDestroy, Input } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { NuxeoPagination, DocumentModel, AdvanceSearch } from '@core/api';

@Component({
  selector: 'tbwa-home-search-form',
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

  @Input()
  set backgroudDocument(doc: DocumentModel) {
    if (doc) {
      this.backgroudUrl = doc.thumbnailUrl;
    }
  }

  private subscription: Subscription = new Subscription();

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
    this.router.navigate([this.redirectUrl], { queryParamsHandling: 'merge', queryParams });
  }

}
