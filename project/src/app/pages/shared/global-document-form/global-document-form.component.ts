import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { DocumentModel, UserModel } from '@core/api';
import { isValueEmpty } from '@core/services/helpers';
import { of as observableOf, Observable, Subscription, Subject, combineLatest } from 'rxjs';
import { concatMap, tap } from 'rxjs/operators';
import { DocumentFormEvent, DocumentFormSettings } from '../document-form/document-form.interface';
import { DocumentPageService } from '../services/document-page.service';

export interface DocumentModelForm {
  metadata: any;
  document: DocumentModel;
}

@Component({
  template: ``,
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
    this.beforeSave = metadata.beforeSave || this.beforeSave;
    this.afterSave = metadata.afterSave || this.afterSave;
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

  beforeSave: (doc: DocumentModel, user: UserModel) => DocumentModel = (doc: DocumentModel, user: UserModel) => doc;

  afterSave: (doc: DocumentModel, user: UserModel) => Observable<DocumentModel> = (doc: DocumentModel, user: UserModel) => observableOf(doc);

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

  protected initializeDocument(parent: DocumentModel, docType: string): Observable<DocumentModel> {
    return this.documentPageService.initializeDocument(parent, docType);
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
    this.formSettings$.next(this.getDocumentFormSettings().update(settings));
  }

  protected getDocumentFormSettings(): DocumentFormSettings {
    const settings = this.getFormSettings();
    settings.accordionSettings = this.getFormAccordion();
    settings.switchTabSettings = this.getFormSwitchTab();
    settings.formModel = this.getFormModels();
    return new DocumentFormSettings(settings);
  }

  protected getFormSettings(): any {
    return {};
  }

  protected getFormAccordion(): any[] {
    return [];
  }

  protected getFormSwitchTab(): any[] {
    return [];
  }

  protected getFormModels(): any[] {
    return [];
  }

  protected getFormLayout(): any {
    return {};
  }

}
