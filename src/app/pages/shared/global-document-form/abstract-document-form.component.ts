import { Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { DocumentModel, NuxeoApiService, NuxeoAutomations } from '@core/api';
import { of as observableOf, Observable, Subscription, Subject } from 'rxjs';
import { DocumentFormEvent } from '../document-form/document-form.interface';
import { switchMap, tap } from 'rxjs/operators';

export interface DocumentModelForm {
  metadata: any;
  document: DocumentModel;
}

export abstract class AbstractDocumentFormComponent implements DocumentModelForm, OnInit, OnDestroy {

  document$: Subject<DocumentModel> = new Subject<DocumentModel>();

  document: DocumentModel;

  formLayout: any = {};

  settings: any[] = [];

  accordions: any = {};

  @Input()
  set documentModel(doc: DocumentModel) {
    this.setFormDocument(doc);
  }

  @Input()
  set metadata(metadata: any) {
    this.formMode = (metadata.formMode || 'create');
  }

  @Output() callback: EventEmitter<DocumentFormEvent> = new EventEmitter<DocumentFormEvent>();

  protected subscription: Subscription = new Subscription();

  protected documentType: string;

  protected formMode: 'create' | 'edit';

  constructor(protected nuxeoApi: NuxeoApiService) {
    this.onDocumentChanged();
  }

  ngOnInit() {
    this.onInit();
  }

  ngOnDestroy() {
    this.onDestroy();
  }

  getDocType(): string {
    return this.documentType;
  }

  setFormDocument(doc: DocumentModel): void {
    if (doc) {
      this.document$.next(doc);
    }
  }

  onCallback(callback: DocumentFormEvent): void {
    this.callback.next(callback);
  }

  protected initializeDocument(parent: DocumentModel, docType: string): Observable<DocumentModel> {
    return this.nuxeoApi.operation(NuxeoAutomations.InitializeDocument, { type: docType }, parent.uid, { schemas: '*' })
      .pipe(
        tap((doc: DocumentModel) => {
          doc.setParent(parent);
          doc.path = parent.uid;
          doc.parentRef = parent.uid;
        }),
      );
  }

  protected beforeSetDocument(doc: DocumentModel): Observable<DocumentModel> {
    return this.formMode === 'create' ? this.beforeOnCreation(doc) : this.beforeOnEdit(doc);
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
    const subscription = this.document$.pipe(
      switchMap((doc: DocumentModel) => this.beforeSetDocument(doc)),
    ).subscribe((doc: DocumentModel) => {
      this.document = doc;
    });
    this.subscription.add(subscription);
  }

  protected performForm(): void {
    this.settings = this.getSettings();
    this.formLayout = this.getFormLayout();
    this.accordions = this.getAccordionSettings();
  }

  protected getAccordionSettings(): any[] {
    return [];
  }

  protected abstract getSettings(): any[];
  protected abstract getFormLayout(): any;
}
