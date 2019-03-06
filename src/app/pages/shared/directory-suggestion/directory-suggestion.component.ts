import { Component, Input, forwardRef, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { OptionModel } from '../option-select/option-select.interface';
import { NuxeoAutomations, DirectoryEntry, NuxeoApiService, NuxeoResponse } from '@core/api';
import { Subscription, Observable, of as observableOf, Subject } from 'rxjs';
import { tap, takeWhile, debounceTime, distinctUntilChanged, switchMap, share, map } from 'rxjs/operators';

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

  loading: boolean = false;

  options$: Observable<OptionModel[]>;

  filter$ = new Subject<string>();

  selectedItems: OptionModel[] = [];

  private disabled: boolean = false;

  private _onChange = (_) => { };

  private _onTouched = () => { };

  private subscription: Subscription = new Subscription();

  @Input() directoryName: string;

  @Input() placeholder: string;

  @Input() contains: boolean = false;

  constructor(private nuxeoApi: NuxeoApiService) { }

  onChange(event: OptionModel[]) {
    if (event.constructor.name === 'Array') {
      this._onChange(event.map(x => x.value));
    }
  }

  ngOnInit() {
    this.search();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  writeValue(value: any): void {
    this.selectedItems = (value === null || value === undefined || value === '' ? [] : value);
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

  private search(): void {
    const subscription = this.filter$.pipe(
      takeWhile((term: string) => !this.disabled && term !== null),
      debounceTime(500),
      distinctUntilChanged(),
      tap(() => this.loading = true),
      switchMap((term: string) => this.getDirectorySuggestions(this.directoryName, term, this.contains).pipe(
        tap(() => this.loading = false),
      )),
      share(),
    ).subscribe((res: OptionModel[]) => {
      this.options$ = observableOf(res);
    });
    this.subscription.add(subscription);
  }

  private getDirectorySuggestions(directoryName: string, searchTerm: string, contains: boolean = false): Observable<any> {
    return this.nuxeoApi.operation(NuxeoAutomations.DirectorySuggestEntries, { directoryName, searchTerm, contains })
      .pipe(map((res: NuxeoResponse) => res.map((entry: any) => new OptionModel(entry.label, entry.id))));
  }

}
