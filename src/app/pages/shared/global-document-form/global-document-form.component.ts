import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { DocumentModel, NuxeoAutomations, UserModel } from '@core/api';
import { of as observableOf, Observable, Subscription, Subject, BehaviorSubject, combineLatest } from 'rxjs';
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

  static readonly COMPONENT_TYPE: string = 'form';

  formSettings$: BehaviorSubject<DocumentFormSettings> = new BehaviorSubject<DocumentFormSettings>(new DocumentFormSettings());

  document$: Subject<DocumentModel> = new Subject<DocumentModel>();

  document: DocumentModel;

  currentUser: UserModel;

  formModels: any[] = [];

  formLayout: any = {};

  accordion: any[] = [];

  beforeSave: Function = (doc: DocumentModel, user: UserModel): DocumentModel => doc;

  afterSave: Function = (doc: DocumentModel, user: UserModel): Observable<DocumentModel> => observableOf(doc);

  @Input()
  set documentModel(doc: DocumentModel) {
    if (doc) {
      this.document$.next(doc);
    }
  }

  @Input()
  set settings(settings: DocumentFormSettings) {
    if (objHasValue(settings)) {
      this.setFormSettings(this.getFormSettings().update(settings));
    }
  }

  @Input()
  set metadata(metadata: any) {
    if (metadata.formSettings) {
      this.setFormSettings(this.getFormSettings().update(metadata.formSettings));
    } else {
      this.setFormSettings(this.getFormSettings().update({ formMode: (metadata.formMode || 'create') }));
    }
    this.beforeSave = metadata.beforeSave || this.beforeSave;
    this.afterSave = metadata.afterSave || this.afterSave;
  }

  @Output() callback: EventEmitter<DocumentFormEvent> = new EventEmitter<DocumentFormEvent>();

  protected subscription: Subscription = new Subscription();

  protected documentType: string;

  constructor(protected documentPageService: DocumentPageService) {
    this.onDocumentChanged();
  }

  ngOnInit(): void {
    this.onInit();
  }

  ngOnDestroy(): void {
    this.onDestroy();
  }

  getDocType(): string {
    return this.documentType;
  }

  setFormDocument(doc: DocumentModel, user: UserModel): void {
    this.currentUser = user;
    this.document = doc;
  }

  onCallback(event: DocumentFormEvent): void {
    this.callback.next(this.beforeOnCallback(event));
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

  protected beforeSetDocument(doc: DocumentModel): Observable<DocumentModel> {
    return this.formSettings$.value.formMode === 'create' ? this.beforeOnCreation(doc) : this.beforeOnEdit(doc);
  }

  protected beforeOnCreation(doc: DocumentModel): Observable<DocumentModel> {
    return observableOf(doc.newInstance(this.getDocType()));
  }

  protected beforeOnEdit(doc: DocumentModel): Observable<DocumentModel> {
    return observableOf(doc);
  }

  protected onInit(): void {
    this.performForm();
    this.onDocumentChanged();
  }

  protected onDestroy(): void {
    this.subscription.unsubscribe();
  }

  protected onDocumentChanged(): void {
    const subscription = combineLatest(
      this.formSettings$,
      this.documentPageService.getCurrentUser(),
      this.document$.pipe(concatMap((doc: DocumentModel) => this.beforeSetDocument(doc))),
    ).subscribe(([formSettings, user, doc]: [DocumentFormSettings, UserModel, DocumentModel]) => {
      this.setFormDocument(doc, user);
    });
    this.subscription.add(subscription);
  }

  protected performForm(): void {
    this.formModels = this.getFormModels();
    this.formLayout = this.getFormLayout();
    this.accordion = this.getFormAccordion();
  }

  protected setFormSettings(settings: any = {}): void {
    const config = this.formSettings$.value.update(settings);
    this.formSettings$.next(config);
  }

  protected getFormSettings(): DocumentFormSettings {
    return new DocumentFormSettings();
  }

  protected getFormAccordion(): any[] {
    return [];
  }

  protected getFormModels(): any[] {
    return [];
  }

  protected getFormLayout(): any {
    return {};
  }

}
