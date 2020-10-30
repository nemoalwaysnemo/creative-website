import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { DocumentModel, NuxeoAutomations, UserModel } from '@core/api';
import { of as observableOf, Observable, Subscription, Subject, combineLatest } from 'rxjs';
import { DocumentFormEvent, DocumentFormSettings } from '../document-form/document-form.interface';
import { DocumentPageService } from '../services/document-page.service';
import { concatMap, tap } from 'rxjs/operators';
import { objHasValue } from '@core/services/helpers';

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
    if (objHasValue(settings)) {
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

  constructor(protected documentPageService: DocumentPageService) {
    this.onDocumentChanged();
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

  ngOnInit(): void {
    this.onInit();
  }

  ngOnDestroy(): void {
    this.onDestroy();
  }

  getDocType(): string {
    return this.documentType;
  }

  setFormDocument(doc: DocumentModel, user: UserModel, settings: DocumentFormSettings): void {
    this.formSettings = settings;
    this.currentUser = user;
    this.document = doc;
  }

  onCallback(event: DocumentFormEvent): void {
    this.callback.next(this.beforeOnCallback(event));
  }

  protected onInit(): void {

  }

  protected beforeOnCallback(event: DocumentFormEvent): DocumentFormEvent {
    return event;
  }

  protected initializeDocument(parent: DocumentModel, docType: string): Observable<DocumentModel> {
    return this.documentPageService.operation(NuxeoAutomations.InitializeDocument, { type: docType }, parent.uid, { schemas: '*' })
      .pipe(
        tap((doc: DocumentModel) => {
          doc.setParent(parent);
          doc.path = parent.uid;
          doc.parentRef = parent.uid;
        }),
      );
  }

  protected beforeSetDocument(formSettings: DocumentFormSettings, doc: DocumentModel, user: UserModel): Observable<DocumentModel> {
    return formSettings.formMode === 'create' ? this.beforeOnCreation(doc) : this.beforeOnEdit(doc);
  }

  protected beforeOnCreation(doc: DocumentModel): Observable<DocumentModel> {
    return observableOf(doc.newInstance(this.getDocType()));
  }

  protected beforeOnEdit(doc: DocumentModel): Observable<DocumentModel> {
    return observableOf(doc);
  }

  protected onDestroy(): void {
    this.subscription.unsubscribe();
  }

  protected onDocumentChanged(): void {
    const subscription = combineLatest([
      this.document$,
      this.documentPageService.getCurrentUser(),
      this.formSettings$,
    ]).pipe(
      concatMap(([doc, user, settings]: [DocumentModel, UserModel, DocumentFormSettings]) => combineLatest([
        this.beforeSetDocument(settings, doc, user),
        observableOf(user),
        observableOf(settings),
      ])),
    ).subscribe(([doc, user, settings]: [DocumentModel, UserModel, DocumentFormSettings]) => {
      this.setFormDocument(doc, user, settings);
    });
    this.subscription.add(subscription);
  }

  protected setFormSettings(settings: any = {}): void {
    this.formSettings$.next(this.getDocumentFormSettings().update(settings));
  }

  protected getDocumentFormSettings(): DocumentFormSettings {
    const settings = this.getFormSettings();
    settings.accordionSettings = this.getFormAccordion();
    settings.switchTabSettings = this.getFormSwitchTab();
    settings.formLayout = this.getFormLayout();
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
