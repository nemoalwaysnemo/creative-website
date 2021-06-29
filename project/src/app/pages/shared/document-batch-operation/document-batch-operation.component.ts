import { Component, Input, Output, OnInit, OnDestroy, forwardRef, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { DocumentModel, UserModel } from '@core/api';
import { isValueEmpty } from '@core/services/helpers';
import { DocumentPageService } from '../services/document-page.service';
import { DocumentFormContext, DocumentFormEvent, DocumentFormSettings } from '../document-form/document-form.interface';
import { of as observableOf, Observable, Subscription, Subject, combineLatest } from 'rxjs';
import { concatMap, map, tap } from 'rxjs/operators';

@Component({
  selector: 'document-batch-operation',
  styleUrls: ['./document-batch-operation.component.scss'],
  templateUrl: './document-batch-operation.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DocumentBatchOperationComponent),
    multi: true,
  }],
})
export class DocumentBatchOperationComponent implements OnInit, OnDestroy {

  @Input()
  set documentModel(doc: DocumentModel | DocumentModel[]) {
    if (doc && !Array.isArray(doc) || Array.isArray(doc) && doc.length > 0) {
      this.documents$.next(Array.isArray(doc) ? doc : [doc]);
    }
  }

  @Input()
  set settings(settings: any) {
    if (!isValueEmpty(settings)) {
      this.formSettings$.next(settings);
    }
  }

  formSettings: DocumentFormSettings;

  documents: DocumentModel[];

  currentUser: UserModel;

  @Output() callback: EventEmitter<DocumentFormEvent> = new EventEmitter<DocumentFormEvent>();

  private formSettings$: Subject<DocumentFormSettings> = new Subject<DocumentFormSettings>();

  private documents$: Subject<DocumentModel[]> = new Subject<DocumentModel[]>();

  private subscription: Subscription = new Subscription();

  @Input() beforeSaveValidation: (ctx: DocumentFormContext) => Observable<boolean> = (ctx: DocumentFormContext) => observableOf(true);

  @Input() beforeSave: (doc: DocumentModel, ctx: DocumentFormContext) => Observable<DocumentModel> = (doc: DocumentModel, ctx: DocumentFormContext) => observableOf(doc);

  @Input() afterSave: (doc: DocumentModel, ctx: DocumentFormContext) => Observable<DocumentModel> = (doc: DocumentModel, ctx: DocumentFormContext) => observableOf(doc);

  @Input() beforeFormSave: (ctx: DocumentFormContext) => Observable<DocumentFormContext> = (ctx: DocumentFormContext) => observableOf(ctx);

  @Input() afterFormSave: (ctx: DocumentFormContext) => Observable<DocumentFormContext> = (ctx: DocumentFormContext) => observableOf(ctx);

  constructor(private documentPageService: DocumentPageService) {
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

  private beforeOnCallback(event: DocumentFormEvent): Observable<DocumentFormEvent> {
    return observableOf(event);
  }

  protected beforeSetDocument(docs: DocumentModel[], user: UserModel, formSettings: DocumentFormSettings): Observable<DocumentModel[]> {
    return formSettings.formMode === 'create' ? this.beforeOnCreation(docs[0], user, formSettings) : this.beforeOnEdit(docs, user, formSettings);
  }

  protected beforeOnCreation(doc: DocumentModel, user: UserModel, formSettings: DocumentFormSettings): Observable<DocumentModel[]> {
    if (formSettings.docType) {
      return this.documentPageService.initializeDocument(doc, formSettings.docType).pipe(map((d: DocumentModel) => [d.setParent(doc, 'target')]));
    } else {
      return observableOf([new DocumentModel({ uid: doc.uid, path: doc.path }, doc.options).setParent(doc)]);
    }
  }

  protected beforeOnEdit(docs: DocumentModel[], user: UserModel, formSettings: DocumentFormSettings): Observable<DocumentModel[]> {
    return observableOf(docs);
  }

  private onDocumentChanged(): void {
    const subscription = combineLatest([
      this.documents$,
      this.documentPageService.getCurrentUser(),
      this.formSettings$,
    ]).pipe(
      concatMap(([docs, user, settings]: [DocumentModel[], UserModel, DocumentFormSettings]) => combineLatest([
        this.beforeSetDocument(docs, user, settings),
        observableOf(user),
        observableOf(settings),
      ])),
    ).subscribe(([docs, user, settings]: [DocumentModel[], UserModel, DocumentFormSettings]) => {
      this.setFormDocument(docs, user, settings);
    });
    this.subscription.add(subscription);
  }

  private setFormDocument(docs: DocumentModel[], user: UserModel, settings: DocumentFormSettings): void {
    this.formSettings = settings;
    this.currentUser = user;
    this.documents = docs;
  }

}
