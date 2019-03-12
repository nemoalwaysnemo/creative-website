import { Component, Input, forwardRef, OnDestroy, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { OptionModel } from '../option-select/option-select.interface';
import { NuxeoAutomations, NuxeoApiService, NuxeoResponse, NuxeoPagination, DocumentModel, DirectoryEntry } from '@core/api';
import { Subscription, Observable, of as observableOf, Subject, BehaviorSubject } from 'rxjs';
import { tap, takeWhile, debounceTime, distinctUntilChanged, switchMap, share, map, filter } from 'rxjs/operators';

@Component({
  selector: 'tbwa-directory-suggestion',
  styleUrls: ['./directory-suggestion.component.scss'],
  templateUrl: './directory-suggestion.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DirectorySuggestionComponent),
    multi: true,
  }],
})
export class DirectorySuggestionComponent implements OnInit, OnDestroy, ControlValueAccessor {

  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  options$: BehaviorSubject<OptionModel[]> = new BehaviorSubject<OptionModel[]>([]);

  filter$ = new Subject<string>();

  selectedItems: OptionModel[] = [];

  private disabled: boolean = false;

  private _onChange = (_) => { };

  private _onTouched = () => { };

  private subscription: Subscription = new Subscription();

  @Input() placeholder: string;

  @Input() directoryName: string;

  @Input() contains: boolean = false;

  @Input() suggestion: boolean = true;

  @Input() providerName: string;

  constructor(private nuxeoApi: NuxeoApiService) { }

  onChange(event: OptionModel[]) {
    if (Array.isArray(event)) {
      this._onChange(event.map(x => x.value));
    }
  }

  ngOnInit() {
    if (this.suggestion === true) {
      this.onSearchSuggestions();
    } else {
      this.getDirectoryEntries(this.directoryName);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  writeValue(val: any): void {
    const value = (val === null || val === undefined || val === '' ? [] : val);
    this.buildDefaultOptions(value);
    this.selectedItems = value;
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  getViewType(): string {
    return this.suggestion ? 'suggestion' : 'list';
  }

  private buildDefaultOptions(value: string[]): void {
    this.options$.next(value.map(x => new OptionModel(x, x)));
  }

  private getSuggestions(searchTerm: string): Observable<OptionModel[]> {
    let res;
    if (this.providerName) {
      res = this.getDocumentSuggestions(this.providerName, searchTerm);
    } else if (this.directoryName) {
      res = this.getDirectorySuggestions(this.directoryName, searchTerm, this.contains);
    } else {
      res = observableOf([]);
    }
    return res;
  }

  private onSearchSuggestions(): void {
    const subscription = this.filter$.pipe(
      filter((searchTerm: string) => searchTerm !== null),
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.loading$.next(true)),
      switchMap((searchTerm: string) => this.getSuggestions(searchTerm)),
      share(),
    ).subscribe((res: OptionModel[]) => {
      this.options$.next(res);
      this.loading$.next(false);
    });
    this.subscription.add(subscription);
  }

  private getDirectorySuggestions(directoryName: string, searchTerm: string, contains: boolean = false): Observable<OptionModel[]> {
    return this.nuxeoApi.operation(NuxeoAutomations.DirectorySuggestEntries, { directoryName, searchTerm, contains })
      .pipe(map((res: NuxeoResponse) => res.map((entry: any) => new OptionModel(entry.label, entry.id))));
  }

  private getDocumentSuggestions(providerName: string, searchTerm: string, pageSize: number = 20): Observable<OptionModel[]> {
    return this.nuxeoApi.operation(NuxeoAutomations.RepositoryPageProvider, { providerName, searchTerm, pageSize })
      .pipe(map((res: NuxeoPagination) => res.entries.map((doc: DocumentModel) => new OptionModel(doc.title, doc.uid))));
  }

  private getDirectoryEntries(directoryName: string): void {
    this.loading$.next(true);
    const subscription = this.nuxeoApi.directory(directoryName).pipe(map((res: DirectoryEntry[]) => res.map((entry: DirectoryEntry) => new OptionModel(entry.label, entry.id))))
      .subscribe((res: OptionModel[]) => {
        this.options$.next(res);
        this.loading$.next(false);
      });
    this.subscription.add(subscription);
  }

}
