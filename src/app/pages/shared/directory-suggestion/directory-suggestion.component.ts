import { Component, Input, forwardRef, OnDestroy, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { OptionModel } from '../option-select/option-select.interface';
import { NuxeoAutomations, NuxeoApiService, NuxeoResponse, NuxeoPagination, DocumentModel, DirectoryEntry } from '@core/api';
import { Subscription, Observable, of as observableOf, Subject, BehaviorSubject } from 'rxjs';
import { tap, takeWhile, debounceTime, distinctUntilChanged, switchMap, share, map, filter } from 'rxjs/operators';
import { ThemeSwitcherComponent } from '@theme/components';

class Suggestion {
  readonly displayLabel: string = '';
  readonly children: any[] = [];
  constructor({ displayLabel, children }) {
    this.displayLabel = displayLabel;
    this.children = children ? children : [];
  }
}

@Component({
  selector: 'directory-suggestion',
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

  @Input() document: DocumentModel;

  @Input() pageSize: number = 20;

  @Input() placeholder: string;

  @Input() directoryName: string;

  @Input() searchUserGroup: boolean = false;

  @Input() contains: boolean = true;

  @Input() suggestion: boolean = true;

  @Input() initSearch: boolean = true;

  @Input() providerName: string;

  @Input() contentViewProvider: string;

  @Input() multiple: boolean;

  private stack: string[] = [];

  private suggestions = [];

  constructor(private nuxeoApi: NuxeoApiService) { }

  onChange(event: any) {
    if (Array.isArray(event)) {
      this._onChange(event.map(x => x.value));
    } else {
      const value = event ? event.value : '';
      this._onChange(value);
    }
  }

  onBlur(event: any) {
    if ((this.selectedItems.length < 1 && this.selectedItems) || !this.selectedItems) this._onTouched();
  }

  ngOnInit() {
    if (this.suggestion === true) {
      this.onSearchSuggestions();
      if (this.initSearch) {
        this.filter$.next('');
      }
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
    const option = typeof value === 'string' ? [value] : value;
    this.options$.next(option.map(x => new OptionModel({ label: x, value: x })));
  }

  private getSuggestions(searchTerm: string, doc?: DocumentModel, pageSize: number = 20): Observable<OptionModel[]> {
    let res: Observable<OptionModel[]>;
    const uuid = doc ? doc.uid : null;
    if (this.providerName) {
      res = this.getDocumentSuggestions(this.providerName, searchTerm, uuid, pageSize);
    } else if (this.contentViewProvider) {
      res = this.getContentViewDocumentSuggestions(this.contentViewProvider, searchTerm, uuid, pageSize);
    } else if (this.directoryName) {
      res = this.getDirectorySuggestions(this.directoryName, searchTerm, this.contains);
    } else if (this.searchUserGroup) {
      res = this.getUserGroupSuggestions(searchTerm);
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
      switchMap((searchTerm: string) => this.getSuggestions(searchTerm, this.document, this.pageSize)),
      share(),
    ).subscribe((res: OptionModel[]) => {
      this.options$.next(res);
      this.loading$.next(false);
    });
    this.subscription.add(subscription);
  }

  private getDirectorySuggestions(directoryName: string, searchTerm: string, contains: boolean = false): Observable<OptionModel[]> {
    return this.nuxeoApi.operation(NuxeoAutomations.DirectorySuggestEntries, { directoryName, searchTerm, contains })
      .pipe(
        map((res: NuxeoPagination[]) => this.flatSuggestions(res)),
        map((res: any) => res.map((entry: any) => new OptionModel({ label: entry.label, value: entry.id, deep: entry.deep }))),
      );
  }

  private getUserGroupSuggestions(searchTerm: string): Observable<OptionModel[]> {
    return this.nuxeoApi.operation(NuxeoAutomations.UserGroupSuggestion, { searchTerm })
      .pipe(
        map((res: any) => res.map((entry: any) => new OptionModel({ label: entry.displayLabel, value: entry.id }))),
      );
  }

  private getDocumentModels(operationName: string, providerName: string, searchTerm: string, input: string = null, pageSize: number = 20): Observable<OptionModel[]> {
    return this.nuxeoApi.operation(operationName, { providerName, searchTerm, pageSize }, input)
      .pipe(map((res: NuxeoPagination) => res.entries.map((doc: DocumentModel) => new OptionModel({ label: doc.title, value: doc.uid }))));
  }

  private getDocumentSuggestions(providerName: string, searchTerm: string, input: string = null, pageSize: number = 20): Observable<OptionModel[]> {
    return this.getDocumentModels(NuxeoAutomations.RepositoryPageProvider, providerName, searchTerm, input, pageSize);
  }

  private getContentViewDocumentSuggestions(providerName: string, searchTerm: string, input: string = null, pageSize: number = 20): Observable<OptionModel[]> {
    return this.getDocumentModels(NuxeoAutomations.ContentViewPageProvider, providerName, searchTerm, input, pageSize);
  }
  private getDirectoryEntries(directoryName: string): void {
    this.loading$.next(true);
    const subscription = this.nuxeoApi.directory(directoryName).pipe(map((res: DirectoryEntry[]) => res.map((entry: DirectoryEntry) => new OptionModel({ label: entry.label, value: entry.id }))))
      .subscribe((res: OptionModel[]) => {
        this.options$.next(res);
        this.loading$.next(false);
      });
    this.subscription.add(subscription);
  }


  private flatSuggestions(res: any[]): any[] {
    if (!!res[0] && !!res[0].children) {
      this.suggestions = [];
      for (const root of res) {
        this.suggestionsIterator(root);
      }
      return this.suggestions;
    } else {
      return res;
    }
  }

  private suggestionsIterator(res: any): any[] {
    const suggestion = new Suggestion(res);
    this.stack.push(suggestion.displayLabel);
    this.suggestions.push({ id: this.stack.join('/'), label: suggestion.displayLabel, deep: 'deep_' + (this.stack.length - 1) });
    suggestion.children.forEach(child => { this.suggestionsIterator(child); });
    this.stack.pop();
    return this.suggestions;
  }
}
