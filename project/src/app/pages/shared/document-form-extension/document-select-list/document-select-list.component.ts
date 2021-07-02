import { Component, Input, forwardRef, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DocumentModel, SearchResponse } from '@core/api';
import { isValueEmpty } from '@core/services/helpers';
import { GlobalSearchFormSettings } from '../../global-search-form/global-search-form.interface';
import { DocumentListViewItem } from '../../document-list-view/document-list-view.interface';
import { DocumentSelectListSettings } from './document-select-list.interface';
import { Observable, Subject, Subscription, timer } from 'rxjs';

@Component({
  selector: 'document-select-list',
  templateUrl: 'document-select-list.component.html',
  styleUrls: ['document-select-list.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DocumentSelectListComponent),
    multi: true,
  }],
})
export class DocumentSelectListComponent implements OnInit, OnDestroy, ControlValueAccessor {

  @Input()
  set settings(settings: DocumentSelectListSettings) {
    if (!isValueEmpty(settings)) {
      this.setFormSettings(settings);
    }
  }

  documents: DocumentModel[] = [];

  baseParams$: Subject<any> = new Subject<any>();

  searchFormSettings: GlobalSearchFormSettings;

  listViewSettings: any = {};

  listViewBuilder: (docs: DocumentModel[]) => DocumentListViewItem[];

  private disabled: boolean = false;

  private subscription: Subscription = new Subscription();

  private _onChange = (_) => { };

  private _onTouched = () => { };

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSelected(event: any): void {
    const selectedUids = event.selected.map((d: DocumentListViewItem) => d.uid);
    this._onChange(selectedUids);
  }

  onResponse(res: SearchResponse): void {
  }

  writeValue(value: any): void {
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

  private setFormSettings(settings: DocumentSelectListSettings): void {
    this.listViewSettings = settings.listViewSettings;
    this.listViewBuilder = settings.listViewBuilder;
    this.documents = settings.documents;
    if (settings.searchParams) {
      this.searchFormSettings = new GlobalSearchFormSettings(Object.assign({ source: 'document-select-list', enableSearchInput: false }, settings.searchFormSettings || {}));
      timer(0).subscribe(() => { this.baseParams$.next(settings.searchParams); });
    }
  }

}
