import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { DocumentModel, UserModel } from '@core/api';
import { isValueEmpty } from '@core/services/helpers';
import { of as observableOf, Observable, Subscription, Subject, combineLatest } from 'rxjs';
import { concatMap, tap } from 'rxjs/operators';
import { DocumentFormContext, DocumentFormEvent, DocumentFormSettings } from '../document-form/document-form.interface';
import { DocumentPageService } from '../services/document-page.service';

export interface DocumentModelForm {
  metadata: any;
  document: DocumentModel;
}

@Component({
  template: '',
})
export class GlobalDocumentFormComponent implements DocumentModelForm, OnInit, OnDestroy {

  @Input()
  set documentModel(doc: DocumentModel) {
    if (doc) {
      this.document$.next(doc);
    }
  }

  @Input()
  set settings(settings: any) {
    if (!isValueEmpty(settings)) {
      this.setFormSettings(settings);
    }
  }

  @Input()
  set metadata(metadata: any) {
    if (metadata.formSettings) {
      this.setFormSettings(metadata.formSettings);
    } else {
      this.setFormSettings({ formMode: (metadata.formMode || 'create') });
    }
    this.afterSave = metadata.afterSave || this.afterSave;
    this.beforeSave = metadata.beforeSave || this.beforeSave;
    this.beforeSaveValidation = metadata.beforeSaveValidation || this.beforeSaveValidation;
  }

  static readonly COMPONENT_TYPE: string = 'form';

  formSettings: DocumentFormSettings;

  document: DocumentModel;

  currentUser: UserModel;

  @Output() callback: EventEmitter<DocumentFormEvent> = new EventEmitter<DocumentFormEvent>();

  protected formSettings$: Subject<DocumentFormSettings> = new Subject<DocumentFormSettings>();

  protected document$: Subject<DocumentModel> = new Subject<DocumentModel>();

  protected subscription: Subscription = new Subscription();

  protected documentType: string;

  beforeSaveValidation: (ctx: DocumentFormContext) => Observable<boolean> = (ctx: DocumentFormContext) => observableOf(true);

  beforeSave: (doc: DocumentModel, ctx: DocumentFormContext) => Observable<DocumentModel> = (doc: DocumentModel, ctx: DocumentFormContext) => observableOf(doc);

  afterSave: (doc: DocumentModel, ctx: DocumentFormContext) => Observable<DocumentModel> = (doc: DocumentModel, ctx: DocumentFormContext) => observableOf(doc);

  beforeFormSave: (ctx: DocumentFormContext) => Observable<DocumentFormContext> = (ctx: DocumentFormContext) => observableOf(ctx);

  afterFormSave: (ctx: DocumentFormContext) => Observable<DocumentFormContext> = (ctx: DocumentFormContext) => observableOf(ctx);

  constructor(protected documentPageService: DocumentPageService) {
    this.onDocumentChanged();
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

  protected getDocType(): string {
    return this.documentType;
  }

  protected beforeOnCallback(event: DocumentFormEvent): Observable<DocumentFormEvent> {
    return observableOf(event);
  }

  protected beforeSetDocument(doc: DocumentModel, user: UserModel, formSettings: DocumentFormSettings): Observable<DocumentModel> {
    return formSettings.formMode === 'create' ? this.beforeOnCreation(doc, user, formSettings) : this.beforeOnEdit(doc, user, formSettings);
  }

  protected beforeOnCreation(doc: DocumentModel, user: UserModel, formSettings: DocumentFormSettings): Observable<DocumentModel> {
    return observableOf(doc.newInstance(this.getDocType()));
  }

  protected beforeOnEdit(doc: DocumentModel, user: UserModel, formSettings: DocumentFormSettings): Observable<DocumentModel> {
    return observableOf(doc);
  }

  protected initializeDocument(parent: DocumentModel, docType: string): Observable<DocumentModel> {
    return this.documentPageService.initializeDocument(parent, docType);
  }

  protected onDocumentChanged(): void {
    const subscription = combineLatest([
      this.document$,
      this.documentPageService.getCurrentUser(),
      this.formSettings$,
    ]).pipe(
      concatMap(([doc, user, settings]: [DocumentModel, UserModel, DocumentFormSettings]) => combineLatest([
        this.beforeSetDocument(doc, user, settings),
        observableOf(user),
        observableOf(settings),
      ])),
    ).subscribe(([doc, user, settings]: [DocumentModel, UserModel, DocumentFormSettings]) => {
      this.setFormDocument(doc, user, settings);
    });
    this.subscription.add(subscription);
  }

  protected setFormDocument(doc: DocumentModel, user: UserModel, settings: DocumentFormSettings): void {
    this.formSettings = settings;
    this.currentUser = user;
    this.document = doc;
  }

  protected setFormSettings(settings: any = {}): void {
    const defaultSettings = this.getDocumentFormSettings(settings);
    this.formSettings$.next(defaultSettings.update(settings));
  }

  protected getDocumentFormSettings(options: any = {}): DocumentFormSettings {
    const settings = this.getFormSettings(options);
    settings.accordionSettings = this.getFormAccordion(options);
    settings.switchTabSettings = this.getFormSwitchTab(options);
    settings.formModel = this.getFormModels(options);
    return new DocumentFormSettings(settings);
  }

  protected getFormSettings(options: any = {}): any {
    return {};
  }

  protected getFormAccordion(options: any = {}): any[] {
    return [];
  }

  protected getFormSwitchTab(options: any = {}): any[] {
    return [];
  }

  protected getFormModels(options: any = {}): any[] {
    return [];
  }

}
