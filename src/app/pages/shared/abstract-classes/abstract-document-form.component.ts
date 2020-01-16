import { Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { DocumentModel, NuxeoApiService, NuxeoAutomations } from '@core/api';
import { of as observableOf, Observable, Subscription, Subject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

export interface DocumentModelForm {
  mode: string;
  docType: string;
  document: DocumentModel;
}

export interface CallbackModel {
  action: 'cancel' | 'created' | 'updated';
  message: string;
  doc: DocumentModel | {};
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
  set docType(docType: string) {
    if (docType) {
      this.documentType = docType;
    }
  }

  @Input() mode: 'create' | 'edit' = 'create';

  @Output() onCreated: EventEmitter<DocumentModel[]> = new EventEmitter<DocumentModel[]>();

  @Output() onUpdated: EventEmitter<DocumentModel> = new EventEmitter<DocumentModel>();

  @Output() onCanceled: EventEmitter<DocumentModel> = new EventEmitter<DocumentModel>();

  @Output() onCallback: EventEmitter<CallbackModel> = new EventEmitter<CallbackModel>();

  protected subscription: Subscription = new Subscription();

  protected documentType: string;

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

  protected initializeDocument(parent: DocumentModel, docType: string): Observable<DocumentModel> {
    return this.nuxeoApi.operation(NuxeoAutomations.InitializeDocument, { type: docType }, parent.uid, { schemas: '*' })
      .pipe(
        tap((doc: DocumentModel) => {
          doc.setParent(parent);
          doc.parentRef = parent.uid;
        }),
      );
  }

  protected beforeSetDocument(doc: DocumentModel): Observable<DocumentModel> {
    if (this.mode === 'create') {
      return observableOf(doc.newInstance(this.getDocType()));
    }
    return observableOf(doc);
  }

  protected onInit(): void {
    this.performForm();
    this.onDocumentChanged();
  }

  protected onDestroy(): void {
    this.subscription.unsubscribe();
  }

  public created(doc: DocumentModel[]): void {
    this.onCreated.next(doc);
  }

  public updated(doc: DocumentModel): void {
    this.onUpdated.next(doc);
  }

  public canceled(doc: DocumentModel): void {
    this.onCanceled.next(doc);
  }

  public callback(callback: CallbackModel): void {
    this.onCallback.next(callback);
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
