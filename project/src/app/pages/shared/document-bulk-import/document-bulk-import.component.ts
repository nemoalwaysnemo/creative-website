import { Component, Input, Output, OnInit, OnDestroy, forwardRef, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { DocumentModel, UserModel } from '@core/api';
import { isValueEmpty } from '@core/services/helpers';
import { DocumentPageService } from '../services/document-page.service';
import { DocumentFormContext, DocumentFormEvent, DocumentFormSettings } from '../document-form/document-form.interface';
import { of as observableOf, Observable, Subscription, Subject, combineLatest } from 'rxjs';
import { concatMap, tap } from 'rxjs/operators';

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
export class DocumentBulkImportComponent implements OnInit, OnDestroy {

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

  private formSettings$: Subject<DocumentFormSettings> = new Subject<DocumentFormSettings>();

  private document$: Subject<DocumentModel> = new Subject<DocumentModel>();

  private subscription: Subscription = new Subscription();

  beforeSave: (doc: DocumentModel, ctx: DocumentFormContext) => Observable<DocumentModel> = (doc: DocumentModel, ctx: DocumentFormContext) => observableOf(doc);

  afterSave: (doc: DocumentModel, ctx: DocumentFormContext) => Observable<DocumentModel> = (doc: DocumentModel, ctx: DocumentFormContext) => observableOf(doc);

  beforeSaveValidation: (ctx: DocumentFormContext) => Observable<boolean> = (ctx: DocumentFormContext) => observableOf(true);

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

  private beforeSetDocument(doc: DocumentModel, user: UserModel, settings: DocumentFormSettings): Observable<DocumentModel> {
    const document = new DocumentModel({ uid: doc.uid, path: doc.path }, doc.options).setParent(doc);
    return observableOf(document);
  }

  private onDocumentChanged(): void {
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

  private setFormDocument(doc: DocumentModel, user: UserModel, settings: DocumentFormSettings): void {
    this.formSettings = settings;
    this.currentUser = user;
    this.document = doc;
  }

}
