import { Component, Input, forwardRef, OnDestroy, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { OptionModel } from '../option-select/option-select.interface';
import { NuxeoAutomations, NuxeoApiService, NuxeoPagination, DocumentModel, DirectoryEntry } from '@core/api';
import { Subscription, Observable, of as observableOf, Subject, BehaviorSubject } from 'rxjs';
import { tap, debounceTime, distinctUntilChanged, switchMap, share, map, filter, concatMap } from 'rxjs/operators';

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

  @Input() searchUserGroup: boolean = false;

  @Input() contains: boolean = true;

  @Input() suggestion: boolean = true;

  @Input() initSearch: boolean = true;

  @Input() directoryName: string; // vocabulary

  @Input() providerName: string; // document page-provider

  @Input() operationName: string; // operation

  @Input() contentViewProvider: string; // content view page-provider

  @Input() multiple: boolean;

  @Input() afterSearch: Function = (options: OptionModel[]): Observable<OptionModel[]> => observableOf(options);

  @Input() onResponsed: Function = (res: any): any => res;

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
      this.onSearchTriggered();
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
    const parentRef = doc ? doc.parentRef : null;
    if (this.providerName) {
      res = this.getDocumentSuggestions(this.providerName, searchTerm, null, pageSize);
    } else if (this.operationName) { // search parent's properties
      res = this.getOperationSuggestions(this.operationName, searchTerm, parentRef);
    } else if (this.contentViewProvider) { // search parent's properties
      res = this.getContentViewDocumentSuggestions(this.contentViewProvider, searchTerm, parentRef, pageSize);
    } else if (this.directoryName) {
      res = this.getDirectorySuggestions(this.directoryName, searchTerm, this.contains);
    } else if (this.searchUserGroup) {
      res = this.getUserGroupSuggestions(searchTerm);
    } else {
      res = observableOf([]);
    }
    return res;
  }

  private onSearchTriggered(): void {
    const subscription = this.filter$.pipe(
      filter((searchTerm: string) => searchTerm !== null),
      debounceTime(300),
      filter(_ => !this.disabled),
      distinctUntilChanged(),
      tap(() => this.loading$.next(true)),
      switchMap((searchTerm: string) => this.getSuggestions(searchTerm, this.document, this.pageSize)),
      concatMap((options: OptionModel[]) => this.afterSearch(options)),
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
    return this.nuxeoApi.operation(NuxeoAutomations.ContentViewPageProvider, { providerName, searchTerm, pageSize }, input)
      .pipe(map((res: NuxeoPagination) => res.entries.map((doc: DocumentModel) => new OptionModel({ label: doc.title, value: doc.uid }))));
  }

  private getOperationSuggestions(operationName: string, searchTerm: string, input: string): Observable<OptionModel[]> {
    return this.nuxeoApi.operation(operationName, { docId: input, searchTerm }, input).pipe(map((res: any) => this.onResponsed.call(this, res)));
  }

  private getDirectoryEntries(directoryName: string): void {
    const subscription = this.nuxeoApi.directory(directoryName)
      .pipe(
        filter(_ => !this.disabled),
        tap(_ => this.loading$.next(true)),
        map((res: DirectoryEntry[]) => res.map((entry: DirectoryEntry) => new OptionModel({ label: entry.label, value: entry.id }))),
        concatMap((options: OptionModel[]) => this.afterSearch(options)),
      )
      .subscribe((options: OptionModel[]) => {
        this.options$.next(options);
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
