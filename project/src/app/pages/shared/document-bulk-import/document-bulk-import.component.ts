import { Component, Input, Output, OnInit, OnDestroy, forwardRef, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DocumentModel, UserModel } from '@core/api';
import { DynamicBatchUploadModel, DynamicDragDropFileZoneModel } from '@core/custom';
import { isValueEmpty } from '@core/services/helpers';
import { of as observableOf, Observable, Subscription, Subject, combineLatest } from 'rxjs';
import { concatMap, tap } from 'rxjs/operators';
import { DocumentFormEvent, DocumentFormSettings } from '../document-form/document-form.interface';
import { DocumentPageService } from '../services/document-page.service';
import { DocumentBulkImportSettings } from './document-bulk-import.interface';

@Component({
  selector: 'document-bulk-import',
  styleUrls: ['./document-bulk-import.component.scss'],
  templateUrl: './document-bulk-import.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DocumentBulkImportComponent),
    multi: true,
  }],
})
export class DocumentBulkImportComponent implements OnInit, OnDestroy, ControlValueAccessor {

  @Input()
  set documentModel(doc: DocumentModel) {
    if (doc) {
      this.document$.next(doc);
    }
  }

  @Input()
  set settings(settings: any) {
    if (!isValueEmpty(settings)) {
      this.formSettings$.next(settings);
    }
  }

  formSettings: DocumentFormSettings;

  document: DocumentModel;

  currentUser: UserModel;

  disabled: boolean = false;

  @Output() callback: EventEmitter<DocumentFormEvent> = new EventEmitter<DocumentFormEvent>();

  private formSettings$: Subject<DocumentBulkImportSettings> = new Subject<DocumentBulkImportSettings>();

  private document$: Subject<DocumentModel> = new Subject<DocumentModel>();

  private subscription: Subscription = new Subscription();

  private _onChange = (_) => { };

  private _onTouched = () => { };

  beforeSave: (doc: DocumentModel, user: UserModel) => DocumentModel = (doc: DocumentModel, user: UserModel) => doc;

  afterSave: (doc: DocumentModel, user: UserModel) => Observable<DocumentModel> = (doc: DocumentModel, user: UserModel) => observableOf(doc);

  constructor(private documentPageService: DocumentPageService) {
    this.onDocumentChanged();
  }

  writeValue(values: any): void {

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

  ngOnInit(): void {
    this.onInit();
  }

  ngOnDestroy(): void {
    this.onDestroy();
  }

  onCallback(event: DocumentFormEvent): void {
    observableOf(event).pipe(
      concatMap((e: DocumentFormEvent) => this.beforeOnCallback(e)),
      tap((e: DocumentFormEvent) => this.callback.next(e)),
    ).subscribe();
  }

  protected onInit(): void {

  }

  protected onDestroy(): void {
    this.subscription.unsubscribe();
  }

  private beforeOnCallback(event: DocumentFormEvent): Observable<DocumentFormEvent> {
    return observableOf(event);
  }

  private beforeSetDocument(doc: DocumentModel, user: UserModel, settings: DocumentBulkImportSettings): Observable<DocumentModel> {
    return observableOf(doc);
  }

  private onDocumentChanged(): void {
    const subscription = combineLatest([
      this.document$,
      this.documentPageService.getCurrentUser(),
      this.formSettings$,
    ]).pipe(
      concatMap(([doc, user, settings]: [DocumentModel, UserModel, DocumentBulkImportSettings]) => combineLatest([
        this.beforeSetDocument(doc, user, settings),
        observableOf(user),
        observableOf(settings),
      ])),
    ).subscribe(([doc, user, settings]: [DocumentModel, UserModel, DocumentBulkImportSettings]) => {
      this.setFormDocument(doc, user, settings);
    });
    this.subscription.add(subscription);
  }

  private setFormDocument(doc: DocumentModel, user: UserModel, settings: DocumentBulkImportSettings): void {
    this.formSettings = this.performFormSettings(settings);
    this.currentUser = user;
    this.document = doc;
  }

  private performFormSettings(settings: DocumentBulkImportSettings): DocumentFormSettings {
    settings.formSettings.formModel = this.getDefaultFormModel(settings);
    return settings.formSettings;
  }

  private getDefaultFormModel(settings: DocumentBulkImportSettings): any[] {
    return [
      new DynamicDragDropFileZoneModel<string>({
        id: 'file:content',
        formMode: 'create',
        settings: {
          xpath: 'file:content',
          queueLimit: settings.queueLimit,
          placeholder: settings.placeholder,
          acceptTypes: settings.acceptTypes,
        },
      }),
      new DynamicBatchUploadModel<string>({
        id: 'batchUpload',
        formMode: 'create',
        settings: {
          enableForm: true,
          enableAction: true,
          formModel: settings.formModel,
        },
      }),
    ];
  }
}
