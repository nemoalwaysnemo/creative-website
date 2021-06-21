import { Component, OnInit, Input, OnDestroy, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { deepExtend, isValueEmpty } from '@core/services/helpers';
import { UserModel, DocumentModel, NuxeoUploadResponse } from '@core/api';
import { DocumentPageService } from '../services/document-page.service';
import { DynamicNGFormSettings } from '../document-form-extension/dynamic-ng-form';
import { DocumentFormContext, DocumentFormEvent, DocumentFormSettings, DocumentFormStatus } from './document-form.interface';
import { DynamicFormService, DynamicFormControlModel, DynamicBatchUploadModel, DynamicGalleryUploadModel, DynamicFormModel, DynamicListModel } from '@core/custom';
import { Observable, of as observableOf, forkJoin, Subject, Subscription, combineLatest, BehaviorSubject, timer } from 'rxjs';
import { concatMap, filter, map, tap } from 'rxjs/operators';

@Component({
  template: '',
})
export class BaseDocumentFormComponent implements OnInit, OnDestroy {

  formGroup: FormGroup;

  uploadCount: number = 0;

  ctx: DocumentFormContext;

  ngFormSettings: DynamicNGFormSettings;

  formStatus$: BehaviorSubject<DocumentFormStatus> = new BehaviorSubject<DocumentFormStatus>(new DocumentFormStatus());

  protected subscription: Subscription = new Subscription();

  protected documents$: BehaviorSubject<DocumentModel[]> = new BehaviorSubject<DocumentModel[]>([]);

  protected currentUser$: Subject<UserModel> = new Subject<UserModel>();

  protected formSettings$: Subject<DocumentFormSettings> = new Subject<DocumentFormSettings>();

  protected saveEvent$: Subject<DocumentFormContext> = new Subject<DocumentFormContext>();

  @Input()
  set document(doc: DocumentModel | DocumentModel[]) {
    if (doc && !Array.isArray(doc) || Array.isArray(doc) && doc.length > 0) {
      this.documents$.next(this.prepareFiles(doc));
    }
  }

  @Input()
  set user(user: UserModel) {
    if (!isValueEmpty(user)) {
      this.currentUser$.next(user);
    }
  }

  @Input()
  set settings(settings: DocumentFormSettings) {
    if (!isValueEmpty(settings)) {
      this.formSettings$.next(settings);
    }
  }

  @Input() loading: boolean = true;

  @Output() callback: EventEmitter<DocumentFormEvent> = new EventEmitter<DocumentFormEvent>();

  @Input() beforeSaveValidation: (ctx: DocumentFormContext) => Observable<boolean> = (ctx: DocumentFormContext) => observableOf(true);

  @Input() beforeSave: (doc: DocumentModel, ctx: DocumentFormContext) => Observable<DocumentModel> = (doc: DocumentModel, ctx: DocumentFormContext) => observableOf(doc);

  @Input() afterSave: (doc: DocumentModel, ctx: DocumentFormContext) => Observable<DocumentModel> = (doc: DocumentModel, ctx: DocumentFormContext) => observableOf(doc);

  @Input() beforeFormSave: (ctx: DocumentFormContext) => Observable<DocumentFormContext> = (ctx: DocumentFormContext) => observableOf(ctx);

  @Input() afterFormSave: (ctx: DocumentFormContext) => Observable<DocumentFormContext> = (ctx: DocumentFormContext) => observableOf(ctx);

  constructor(protected documentPageService: DocumentPageService, protected formService: DynamicFormService) {
    this.onDocumentsChanged();
    this.onSavePerformed();
  }

  ngOnInit(): void {
    this.onInit();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onBlur(event: any): void {
    this.callback.emit(new DocumentFormEvent({ action: 'onBlur', status: this.getFormStatus(), formValue: this.getFormValue(), doc: this.ctx.currentDocument, ngFormSettings: this.ngFormSettings }));
  }

  onChange(event: any): void {

  }

  onFocus(event: any): void {

  }

  onCustomEvent(event: any): void {
    if (event.type === 'VALID') {
      this.updateFormStatus({ childrenValid: event.$event.response });
    }
    if (['BATCH_UPLOAD', 'GALLERY_UPLOAD'].includes(event.type)) {
      this.performUploadEvent(event);
    }
    if (event.type === 'SWITCH_TAB_CHANGED') {
      this.performSwitchEvent(event);
    }
  }

  onSave(context?: DocumentFormContext): void {
    const ctx = context || this.ctx;
    if (isValueEmpty(ctx.action)) {
      ctx.action = {
        action: 'SaveButtonClicked',
        button: 'save',
      };
    }
    this.updateFormStatus({ submitting: true });
    this.triggerUpload(ctx || this.ctx);
  }

  onCancel(): void {
    this.callback.emit(new DocumentFormEvent({ action: 'Canceled', doc: this.ctx.currentDocument, context: this.ctx }));
    if (this.ctx.formSettings.resetFormAfterDone) {
      this.resetForm();
    }
  }

  onCustomButton(button: any): void {
    this.callback.emit(new DocumentFormEvent({ action: 'CustomButtonClicked', button: button.name, formValue: this.getFormValue(), doc: this.ctx.currentDocument, context: this.ctx }));
    if (button.triggerSave) {
      this.ctx.action = {
        action: 'CustomButtonClicked',
        button: button.name,
      };
      this.onSave(this.ctx);
    }
  }

  protected onInit(): void {

  }

  protected updateFormStatus(status: any = {}): void {
    this.formStatus$.next(this.formStatus$.value.update(status));
  }

  protected getFormStatus(key?: string): any {
    return key ? this.formStatus$.value[key] : this.formStatus$.value;
  }

  private performUploadEvent(event: any): void {
    this.performBatchUpload(event);
    this.callback.emit(new DocumentFormEvent({
      action: 'UploadFilesChanged',
      actionType: event.$event.type,
      uploadType: event.type,
      doc: this.ctx.currentDocument,
      status: this.getFormStatus(),
      formValue: this.getFormValue(),
      ngFormSettings: this.ngFormSettings,
    }));
  }

  private performSwitchEvent(event: any): void {
    this.performSwitchUploadModel(event.model);
    this.callback.emit(new DocumentFormEvent({ action: 'SwitchTabChanged', tabs: event.tabs, selected: event.selected, model: event.model, status: this.getFormStatus(), formValue: this.getFormValue(), doc: this.ctx.currentDocument }));
  }

  protected createFormModel(settings: string | any[]): DynamicFormModel {
    return this.formService.fromJSON(settings);
  }

  protected createFormGroup(formModel: DynamicFormModel): FormGroup {
    return this.formService.createFormGroup(formModel);
  }

  protected prepareFormModel(ctx: DocumentFormContext, formModel: DynamicFormModel): DynamicFormModel {
    const formModels = formModel.map((m: DynamicFormControlModel) => {
      const model = ctx.formSettings.enableBulkImport ? Object.assign({}, m) : m;
      const modelValue = ctx.currentDocument.get(model.field);
      if (model.hiddenFn) { model.hidden = model.hiddenFn(ctx); }
      if (model.settings) { model.settings.formMode = ctx.formSettings.formMode; }
      if (model.document) { model.document = ctx.currentDocument; }
      if (isValueEmpty(modelValue)) {
        if (model.defaultValueFn) {
          model.value = model.defaultValueFn(ctx);
        } else if (!!model.defaultValue) {
          model.value = model.defaultValue;
        }
      } else {
        model.value = modelValue;
      }
      if (model instanceof DynamicListModel) {
        model.settings.items = this.prepareFormModel(ctx, model.settings.items);
      }
      return model;
    });
    return formModels;
  }

  protected performFormModel(ctx: DocumentFormContext, formModel: DynamicFormModel): DynamicFormModel {
    const models = (formModel || []).filter((v) => v.formMode === null || v.formMode === ctx.formSettings.formMode).filter((m: DynamicFormControlModel) => !m.visibleFn || m.visibleFn(ctx));
    return this.prepareFormModel(ctx, models);
  }

  protected performDocumentForm(ctx: DocumentFormContext): void {
    this.prepareDocumentForm(ctx, ctx.formSettings.formModel);
  }

  protected prepareDocumentForm(ctx: DocumentFormContext, formModel: DynamicFormModel): void {
    const models = this.performFormModel(ctx, formModel);
    this.performNgFormSettings(ctx, models);
    this.createDocumentForm(models);
  }

  protected performNgFormSettings(ctx: DocumentFormContext, formModel: DynamicFormModel): void {
    this.ngFormSettings = new DynamicNGFormSettings();
  }

  protected createDocumentForm(models: DynamicFormModel): void {
    this.formGroup = this.createFormGroup(models);
    const subscription = this.formGroup.statusChanges.subscribe((valid: any) => {
      timer(0).subscribe(() => { this.updateFormStatus({ formValid: valid === 'VALID', submitted: false }); });
    });
    this.subscription.add(subscription);
  }

  protected onBeforeSave(ctx: DocumentFormContext): Observable<DocumentFormContext> {
    return this.beforeFormSave(ctx);
  }

  protected onAfterSave(ctx: DocumentFormContext): Observable<DocumentFormContext> {
    return this.afterFormSave(ctx);
  }

  protected onSavePerformed(): void {
    const subscription = this.saveEvent$.pipe(
      tap((ctx: DocumentFormContext) => {
        ctx.afterSave = this.afterSave;
        ctx.beforeSave = this.beforeSave;
        ctx.beforeSaveValidation = this.beforeSaveValidation;
      }),
      concatMap((ctx: DocumentFormContext) => ctx.beforeSaveValidation(ctx).pipe(map((formValid: boolean) => ctx.update({ formValid })))),
      filter((ctx: DocumentFormContext) => ctx.formValid),
      concatMap((ctx: DocumentFormContext) => this.onBeforeSave(ctx)),
      concatMap((ctx: DocumentFormContext) => this.performSave(ctx)),
      concatMap((ctx: DocumentFormContext) => this.onAfterSave(ctx)),
      concatMap((ctx: DocumentFormContext) => this.performSaved(ctx)),
    ).subscribe();
    this.subscription.add(subscription);
  }

  protected onDocumentsChanged(): void {
    const subscription = combineLatest([
      this.documents$,
      this.currentUser$,
      this.formSettings$,
    ]).subscribe(([docs, user, settings]: [DocumentModel[], UserModel, DocumentFormSettings]) => {
      this.loading = false;
      this.setFormDocument(docs, user, settings);
      this.performDocumentForm(this.ctx);
    });
    this.subscription.add(subscription);
  }

  protected setFormDocument(documents: DocumentModel[], user: UserModel, formSettings: DocumentFormSettings): void {
    this.ctx = this.newSaveContext(documents, user, formSettings);
  }

  protected prepareProperties(props: any = {}, formValue: any = {}): any {
    const formValues = {};
    Object.keys(formValue).forEach((key: string) => {
      if (key.includes(':')) { formValues[key] = formValue[key]; }
    });
    Object.keys(props).forEach((key: string) => {
      if (!key.includes(':') || ['file:content', 'files:files'].includes(key)) { delete props[key]; }
    });
    const properties = deepExtend({}, props, formValues);
    return properties;
  }

  protected getFormValue(field?: string): any {
    return field ? this.formGroup.value[field] : this.formGroup.value;
  }

  protected getUploadFiles(uploadModel: DynamicFormControlModel): NuxeoUploadResponse[] {
    return uploadModel ? (this.getFormValue(uploadModel.field) || []).filter((res: NuxeoUploadResponse) => !res.original) : [];
  }

  protected triggerUpload(ctx: DocumentFormContext): void {
    if (this.getFormStatus('uploadState') === 'prepared' && this.getUploadFiles(ctx.uploadModel).length > 0) {
      this.formService.triggerEvent({ name: this.getUploadName(ctx.uploadModel), type: 'FileUpload', data: {} });
    } else {
      this.triggerSave(ctx);
    }
  }

  protected triggerSave(ctx: DocumentFormContext): void {
    this.saveEvent$.next(ctx);
  }

  protected newSaveContext(documents: DocumentModel[], user: UserModel, formSettings: DocumentFormSettings, uploadModel?: DynamicFormControlModel): DocumentFormContext {
    return new DocumentFormContext({ user, documents, formSettings, uploadModel });
  }

  protected performSave(ctx: DocumentFormContext): Observable<DocumentFormContext> {
    return (ctx.formSettings.formMode === 'create' ? this.performCreate(ctx) : this.performUpdate(ctx)).pipe(
      map((docs: DocumentModel[]) => ctx.updatePerformedDocuments(docs)),
    );
  }

  protected performCreate(ctx: DocumentFormContext): Observable<DocumentModel[]> {
    let documents = [];
    if (ctx.currentDocument.type && !isValueEmpty(ctx.formSettings.formModel)) {
      ctx.currentDocument.properties = this.prepareProperties(ctx.currentDocument.properties, this.getFormValue());
      documents.push(ctx.currentDocument);
    }
    if (this.getFormStatus('uploadState') === 'uploaded') {
      if (ctx.formSettings.enableBatchSyncCreate) {
        documents = documents.concat(this.attachUploadFiles(ctx));
      } else {
        ctx.documents = this.attachUploadFiles(ctx);
      }
    }
    return this.createDocuments(documents, ctx);
  }

  protected performUpdate(ctx: DocumentFormContext): Observable<DocumentModel[]> {
    let properties = this.prepareProperties({}, this.getFormValue());
    if (this.getFormStatus('uploadState') === 'uploaded') {
      const files = this.getUploadFiles(ctx.uploadModel);
      properties = this.updateUploadFiles(properties, files);
    }
    return this.updateDocuments(ctx.documents, properties, ctx);
  }

  protected performSaved(ctx: DocumentFormContext): Observable<DocumentFormContext> {
    return (ctx.formSettings.formMode === 'create' ? this.onCreated(ctx) : this.onUpdated(ctx)).pipe(
      tap(_ => {
        ctx.documents.length = 0;
        this.updateFormStatus({ submitting: false, submitted: true });
      }),
    );
  }

  protected onCreated(ctx: DocumentFormContext): Observable<DocumentFormContext> {
    this.callback.emit(new DocumentFormEvent({ action: 'Created', messageType: 'success', messageContent: 'Document has been created successfully!', doc: ctx.performedDocuments[0], docs: ctx.performedDocuments, context: this.ctx }));
    if (ctx.formSettings.resetFormAfterDone) {
      this.resetForm();
    }
    return observableOf(ctx);
  }

  protected onUpdated(ctx: DocumentFormContext): Observable<DocumentFormContext> {
    this.callback.emit(new DocumentFormEvent({ action: 'Updated', messageType: 'success', messageContent: 'Document has been updated successfully!', doc: ctx.performedDocuments[0], context: this.ctx }));
    return observableOf(ctx);
  }

  protected createDocuments(docs: DocumentModel[], ctx: DocumentFormContext): Observable<DocumentModel[]> {
    return forkJoin(docs.map(x => this.createDocument(x, ctx)));
  }

  protected createDocument(doc: DocumentModel, ctx: DocumentFormContext): Observable<any> {
    return ctx.beforeSave(doc, ctx).pipe(
      concatMap((d: DocumentModel) => this.documentPageService.createDocument(d, ctx.formSettings.actionOptions)),
      concatMap((d: DocumentModel) => ctx.afterSave(d, ctx)),
    );
  }

  protected updateDocuments(docs: DocumentModel[], properties: any = {}, ctx: DocumentFormContext): Observable<DocumentModel[]> {
    return forkJoin(docs.map(x => this.updateDocument(x, properties, ctx)));
  }

  protected updateDocument(doc: DocumentModel, properties: any = {}, ctx: DocumentFormContext): Observable<DocumentModel> {
    return observableOf(doc.set(properties)).pipe(
      concatMap((d: DocumentModel) => ctx.beforeSave(d, ctx)),
      concatMap((d: DocumentModel) => d.save(ctx.formSettings.actionOptions)),
      concatMap((d: DocumentModel) => ctx.afterSave(d, ctx)),
    );
  }

  protected newDocumentModel(doc: DocumentModel, properties: any = {}): DocumentModel {
    const keys: string[] = Object.keys(doc);
    for (const key of keys) {
      if (!['title', 'uid', 'path', 'type', '_properties'].includes(key)) {
        doc.removeProperties(key);
      }
    }
    if (!isValueEmpty(properties)) {
      doc.properties = Object.assign({}, doc.properties, properties);
    }
    return new DocumentModel(Object.assign({}, doc));
  }

  protected getUploadFileSharedProperties(ctx: DocumentFormContext): any {
    return {};
  }

  protected attachUploadFiles(ctx: DocumentFormContext): DocumentModel[] {
    const files = this.getUploadFiles(ctx.uploadModel);
    const sharedProperties = this.getUploadFileSharedProperties(ctx);
    return files.filter((res: NuxeoUploadResponse) => res.isMainFile()).map((res: NuxeoUploadResponse) => {
      let model: DocumentModel;
      if (ctx.uploadModel.settings.enableForm) {
        if (res.document) {
          res.document.properties = this.prepareProperties(res.document.properties, sharedProperties);
          model = res.document;
        } else if (!isValueEmpty(res.attributes)) {
          model = this.newDocumentModel(ctx.currentDocument, res.attributes);
        }
      } else {
        model = this.newDocumentModel(ctx.currentDocument);
      }
      if (model) {
        model.properties = this.updateUploadFiles(model.properties, res);
        model.properties = this.updateUploadFiles(model.properties, files.filter((r: NuxeoUploadResponse) => !r.isMainFile()));
      }
      delete res.document;
      delete res.attributes;
      return model;
    }).filter((d: DocumentModel) => d);
  }

  protected updateUploadFiles(properties: any, files: NuxeoUploadResponse | NuxeoUploadResponse[]): any {
    const list = Array.isArray(files) ? files : [files];
    list.forEach((file: NuxeoUploadResponse) => {
      if (file.isMainFile()) {
        properties[file.xpath] = file.batchBlob;
      } else {
        if (file.isAttachment() || file.isFileList) {
          const fileValue = properties[file.xpath];
          properties[file.xpath] = Array.isArray(fileValue) ? fileValue.filter((p: any) => p) : [];
          properties[file.xpath].push(file.isAttachment() ? { file: file.batchBlob } : file.batchBlob);
        } else {
          properties[file.xpath] = file.batchBlob;
        }
      }
    });
    return properties;
  }

  protected performBatchUpload(event: any): void {
    const all: NuxeoUploadResponse[] = event.$event.response;
    const added: NuxeoUploadResponse[] = all.filter((res: NuxeoUploadResponse) => !res.original);
    if (added.length === 0 && all.length > 0) {
      //
    } else if (added.length === 0) {
      this.updateFormStatus({ uploadState: null });
    } else if (event.$event.type === 'FileSelected') {
      this.updateFormStatus({ uploadState: 'prepared' });
      this.performUploadModel(this.ngFormSettings, event.type);
      this.onUploadFileSelected(this.ctx.uploadModel, this.ngFormSettings, added);
    } else if (added.some((res: NuxeoUploadResponse) => !res.uploaded && res.kbLoaded > 0)) {
      this.updateFormStatus({ uploadState: 'uploading' });
    } else if (added.every((res: NuxeoUploadResponse) => res.uploaded && res.kbLoaded > 0)) {
      this.updateFormStatus({ uploadState: 'uploaded' });
      this.triggerSave(this.ctx);
    }
    this.uploadCount = added.length;
  }

  protected onUploadFileSelected(uploadModel: DynamicFormControlModel, settings: DynamicNGFormSettings, res: NuxeoUploadResponse[]): void {

  }

  protected getUploadName(model: DynamicFormControlModel): string {
    if (model instanceof DynamicBatchUploadModel) {
      return 'BatchUpload';
    } else if (model instanceof DynamicGalleryUploadModel) {
      return 'GalleryUpload';
    }
  }

  protected performUploadModel(settings: DynamicNGFormSettings, type: string): void {
    if (!this.ctx.uploadModel) {
      switch (type) {
        case 'BATCH_UPLOAD':
          this.ctx.uploadModel = settings.formModel.find((v) => (v instanceof DynamicBatchUploadModel));
          break;
        case 'GALLERY_UPLOAD':
          this.ctx.uploadModel = settings.formModel.find((v) => (v instanceof DynamicGalleryUploadModel));
          break;
      }
    }
  }

  protected performSwitchUploadModel(models: DynamicFormControlModel[]): void {
    this.updateFormStatus({ uploadState: null });
    this.ctx.uploadModel = models.find((x: any) => x.type.includes('UPLOAD'));
  }

  protected prepareFiles(doc: DocumentModel | DocumentModel[]): DocumentModel[] {
    const docs = Array.isArray(doc) ? doc : [doc];
    docs.forEach((d: DocumentModel) => {
      if ((d.get('files:files') || []).every((f: any) => !f.file)) {
        d.removeProperties('files:files');
      }
    });
    return docs;
  }

  protected filterFileName(name: string): string {
    return name.replace(/_/g, ' ').replace(/\s+/g, ' ').replace(/\.\w+$/, '');
  }

  protected resetForm(): void {
    this.formGroup.reset();
  }

}
