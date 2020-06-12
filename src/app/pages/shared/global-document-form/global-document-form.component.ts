import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { DocumentModel, NuxeoAutomations, UserModel } from '@core/api';
import { of as observableOf, Observable, Subscription, Subject, zip } from 'rxjs';
import { DocumentFormEvent } from '../document-form/document-form.interface';
import { DocumentPageService } from '../services/document-page.service';
import { concatMap, tap } from 'rxjs/operators';

export interface DocumentModelForm {
  metadata: any;
  document: DocumentModel;
}

@Component({
  template: ``,
})
export class GlobalDocumentFormComponent implements DocumentModelForm, OnInit, OnDestroy {

  static readonly COMPONENT_TYPE: string = 'form';

  document$: Subject<DocumentModel> = new Subject<DocumentModel>();

  document: DocumentModel;

  currentUser: UserModel;

  settings: any[] = [];

  accordions: any = {};

  formMode: 'create' | 'edit';

  beforeSave: Function = (doc: DocumentModel): DocumentModel => doc;

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

  setFormDocument(doc: DocumentModel): void {
    if (doc) {
      this.document$.next(doc);
    }
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
    const subscription = zip(
      this.documentPageService.getCurrentUserInfo(),
      this.document$.pipe(
        concatMap((doc: DocumentModel) => this.beforeSetDocument(doc)),
      ),
    ).subscribe(([user, doc]: [UserModel, DocumentModel]) => {
      this.currentUser = user;
      this.document = doc;
    });
    this.subscription.add(subscription);
  }

  protected performForm(): void {
    this.settings = this.getSettings();
    this.accordions = this.getAccordionSettings();
  }

  protected getAccordionSettings(): any[] {
    return [];
  }

  protected getSettings(): any[] {
    return [];
  }

}
