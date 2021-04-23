import { Component, Input, Output, EventEmitter, forwardRef, OnInit, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject, BehaviorSubject, Observable, of as observableOf, Subscription } from 'rxjs';
import { OptionModel, ItemTree, OptionSettings } from './option-select.interface';
import { AdvanceSearchService, NuxeoPagination, DocumentModel } from '@core/api';
import { isDocumentUID } from '@core/services/helpers';
import { map, concatMap } from 'rxjs/operators';

export type TitleMap = Map<string, string>;

@Component({
  selector: 'option-select',
  styleUrls: ['./option-select.component.scss'],
  templateUrl: './option-select.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => OptionSelectComponent),
    multi: true,
  }],
})
export class OptionSelectComponent implements OnInit, OnDestroy, ControlValueAccessor {

  @Input()
  set settings(settings: OptionSettings) {
    this.loading = true;
    this.performSettings(settings);
    this.performOptions(this.options);
  }

  placeholder: string = '';

  disabled: boolean = false;

  loading: boolean = false;

  options$: BehaviorSubject<OptionModel[]> = new BehaviorSubject<OptionModel[]>([]);

  filter$ = new Subject<string>();

  selectedItems: OptionModel[] = [];

  configs: OptionSettings = new OptionSettings();

  private options: OptionModel[] = [];

  private beforeRequestSize: number = 10;

  private subscription: Subscription = new Subscription();

  @Output() selected: EventEmitter<OptionModel[]> = new EventEmitter();

  private _onChange = (_) => { };

  private _onTouched = () => { };

  constructor(private advanceSearchService: AdvanceSearchService) {
  }

  ngOnInit(): void {
    this.placeholder = this.configs.placeholder;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onChange(event: OptionModel[]): void {
    if (Array.isArray(event)) {
      this._onChange(event.map(x => x.value));
      this.selected.emit(event);
    }
  }

  customSearchFn(term: string, item: OptionModel): boolean {
    return (new RegExp(term, 'i')).test(item.value);
  }

  onOpen(): void {
    this.placeholder = this.configs.prompt;
  }

  onClose(): void {
    this.placeholder = this.configs.placeholder;
  }

  onClear(): void {
  }

  onSearch(event: OptionModel[]): void {
  }

  onFocus(event: FocusEvent): void {
  }

  onBlur(event: FocusEvent): void {
  }

  onAdd(event: OptionModel): void {
  }

  onRemove(event: OptionModel): void {
  }

  onScroll({ end }): void {
    if (this.loading || this.options.length <= this.getCurrentOptions().length) {
      return;
    }
    if (end + this.beforeRequestSize >= this.getCurrentOptions().length) {
      this.requestMoreOptions();
    }
  }

  onScrollToEnd(): void {
    this.requestMoreOptions();
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

  private getCurrentOptions(): OptionModel[] {
    return this.options$.value;
  }

  private performItems(settings: OptionSettings): OptionModel[] {
    let options = settings.options;
    delete settings['options'];
    if (settings.iteration && options) {
      const tree = new ItemTree('/');
      options.forEach(item => { tree.addNodes(item.value, item.label); });
      tree.plantingTree();
      options = tree.models.length > 0 ? tree.models : options;
    }
    return options;
  }

  private performSettings(settings: OptionSettings): void {
    this.options = this.performItems(settings);
    this.configs = settings;
  }

  private getOptionUids(items: OptionModel[]): string[] {
    return items.filter((x: OptionModel) => x.label.split(/(\s+)/).some(label => isDocumentUID(label))).map((x: OptionModel) => x.value);
  }

  private performOptions(items: OptionModel[]): void {
    const uids = this.getOptionUids(items);
    if (uids.length === 0) {
      this.updateOptions(items);
      items.length = 0;
    } else if (uids.length <= this.configs.bufferSize) {
      this.getAndUpdateOptions(uids, items.splice(0, items.length));
    } else if (uids.length > this.configs.bufferSize) {
      const options = items.splice(0, this.configs.bufferSize);
      this.getAndUpdateOptions(this.getOptionUids(options), options);
    }
  }

  private getAndUpdateOptions(uids: string[], items: OptionModel[]): void {
    this.subscription = this.requestTitleByUIDs(uids).pipe(
      concatMap((mapping: any) => observableOf(this.replaceTitle(mapping, items))),
    ).subscribe((options: OptionModel[]) => {
      this.updateOptions(options);
    });
  }

  private replaceTitle(mapping: any, items: OptionModel[]): OptionModel[] {
    items.forEach((item: OptionModel) => {
      if (mapping[item.value]) {
        item.label = item.label.replace(item.value, mapping[item.value]);
      }
    });
    return items;
  }

  private updateOptions(options: OptionModel[]): void {
    options = this.getCurrentOptions().concat(options);
    this.options$.next(options);
    this.loading = false;
  }

  private requestMoreOptions(): void {
    if (this.options.length !== 0) {
      this.loading = true;
      this.performOptions(this.options);
    }
  }

  private requestTitleByUIDs(uids: string[]): Observable<any> {
    return this.advanceSearchService.requestByUIDs(uids).pipe(
      map((res: NuxeoPagination) => {
        const mapping = [];
        res.entries.forEach((doc: DocumentModel) => { mapping[doc.uid] = doc.title; });
        return mapping;
      }),
    );
  }

}
