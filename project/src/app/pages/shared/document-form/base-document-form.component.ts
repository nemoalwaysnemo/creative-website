import { Component, OnInit, Input, OnDestroy, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { deepExtend, isValueEmpty } from '@core/services/helpers';
import { UserModel, DocumentModel, NuxeoUploadResponse } from '@core/api';
import { DocumentPageService, GlobalEvent } from '../services/document-page.service';
import { DynamicNGFormSettings } from '../document-form-extension/dynamic-ng-form';
import { DocumentFormEvent, DocumentFormSettings, DocumentFormStatus } from './document-form.interface';
import { DynamicFormService, DynamicFormControlModel, DynamicBatchUploadModel, DynamicGalleryUploadModel, DynamicFormModel, DynamicListModel } from '@core/custom';
import { Observable, of as observableOf, forkJoin, Subject, Subscription, combineLatest, BehaviorSubject, timer } from 'rxjs';
import { concatMap, filter, tap } from 'rxjs/operators';

@Component({
  template: '',
})
export class BaseDocumentFormComponent implements OnInit, OnDestroy {

  formGroup: FormGroup;

  modelOperation: Subject<{ model: string, type: string }> = new Subject();

  uploadCount: number = 0;

  ngFormSettings: DynamicNGFormSettings;

  formSettings: DocumentFormSettings = new DocumentFormSettings();

  formStatus$: BehaviorSubject<DocumentFormStatus> = new BehaviorSubject<DocumentFormStatus>(new DocumentFormStatus());

  protected formName: string = 'base-document-form';

  protected currentUser: UserModel;

  protected currentDocument: DocumentModel;

  protected uploadModel: DynamicFormControlModel;

  protected subscription: Subscription = new Subscription();

  protected document$: Subject<DocumentModel> = new Subject<DocumentModel>();

  protected currentUser$: Subject<UserModel> = new Subject<UserModel>();

  protected formSettings$: Subject<DocumentFormSettings> = new Subject<DocumentFormSettings>();

  @Input()
  set document(doc: DocumentModel) {
    if (doc) {
      this.document$.next(this.prepareFiles(doc));
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

  @Input() beforeSave: (doc: DocumentModel, user: UserModel) => DocumentModel = (doc: DocumentModel, user: UserModel) => doc;

  @Input() afterSave: (doc: DocumentModel, user: UserModel) => Observable<DocumentModel> = (doc: DocumentModel, user: UserModel) => observableOf(doc);

  constructor(protected documentPageService: DocumentPageService, protected formService: DynamicFormService) {
    this.onDocumentChanged();
  }

  ngOnInit(): void {
    this.onInit();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onBlur(event: any): void {
    this.callback.emit(new DocumentFormEvent({ action: 'onBlur', status: this.formStatus$.value, formValue: this.getFormValue(), doc: this.currentDocument, ngFormSettings: this.ngFormSettings }));
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

  onSave(): void {
    this.updateFormStatus({ submitting: true });
    if (this.formSettings.formMode === 'create') {
      this.create();
    } else if (this.formSettings.formMode === 'edit') {
      this.update();
    }
  }

  onCancel(): void {
    this.callback.emit(new DocumentFormEvent({ action: 'Canceled', doc: this.currentDocument }));
    if (this.formSettings.resetFormAfterDone) {
      this.resetForm();
    }
  }

  onCustomButton(button: any): void {
    this.callback.emit(new DocumentFormEvent({ action: 'CustomButtonClicked', button: button.name, formValue: this.getFormValue(), doc: this.currentDocument }));
    if (button.triggerSave) {
      this.onSave();
    }
  }

  protected onInit(): void {

  }

  protected updateFormStatus(status: any = {}): void {
    this.formStatus$.next(this.formStatus$.value.update(status));
  }

  private performUploadEvent(event: any): void {
    this.performBatchUpload(event);
    this.callback.emit(new DocumentFormEvent({
      action: 'UploadFilesChanged',
      actionType: event.$event.type,
      uploadType: event.type,
      doc: this.currentDocument,
      status: this.formStatus$.value,
      formValue: this.getFormValue(),
      ngFormSettings: this.ngFormSettings,
    }));
  }

  private performSwitchEvent(event: any): void {
    this.performSwitchUploadModel(event.model);
    this.callback.emit(new DocumentFormEvent({ action: 'SwitchTabChanged', tabs: event.tabs, selected: event.selected, model: event.model, status: this.formStatus$.value, formValue: this.getFormValue(), doc: this.currentDocument }));
  }

  protected prepareFiles(doc: DocumentModel): DocumentModel {
    if ((doc.get('files:files') || []).every((f: any) => !f.file)) {
      doc.set({ 'files:files': [] });
    }
    return doc;
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

  protected createFormModel(settings: string | any[]): DynamicFormModel {
    return this.formService.fromJSON(settings);
  }

  protected createFormGroup(formModel: DynamicFormModel): FormGroup {
    return this.formService.createFormGroup(formModel);
  }

  protected prepareFormModel(doc: DocumentModel, user: UserModel, settings: DocumentFormSettings, formModel: DynamicFormModel): DynamicFormModel {
    const formModels = formModel.map((m: DynamicFormControlModel) => {
      const model = this.formSettings.enableBulkImport ? Object.assign({}, m) : m;
      const modelValue = doc.get(model.field);
      if (model.hiddenFn) { model.hidden = model.hiddenFn(doc, user, settings); }
      if (model.settings) { model.settings.formMode = settings.formMode; }
      if (model.document) { model.document = doc; }
      if (isValueEmpty(modelValue)) {
        if (model.defaultValueFn) {
          model.value = model.defaultValueFn(doc, user, settings);
        } else if (!!model.defaultValue) {
          model.value = model.defaultValue;
        }
      } else {
        model.value = modelValue;
      }
      if (model instanceof DynamicListModel) {
        model.settings.items = this.prepareFormModel(doc, user, settings, model.settings.items);
      }
      return model;
    });
    return formModels;
  }

  protected performFormModel(doc: DocumentModel, user: UserModel, settings: DocumentFormSettings): DynamicFormModel {
    const models = settings.formModel.filter((v) => v.formMode === null || v.formMode === settings.formMode).filter((m: DynamicFormControlModel) => !m.visibleFn || m.visibleFn(doc, user, settings));
    return this.prepareFormModel(doc, user, settings, models);
  }

  protected performDocumentForm(doc: DocumentModel, user: UserModel, settings: DocumentFormSettings): void {
    const models = this.performFormModel(doc, user, settings);
    this.performNgFormSettings(doc, user, settings, models);
    this.createDocumentForm(models);
  }

  protected performNgFormSettings(doc: DocumentModel, user: UserModel, settings: DocumentFormSettings, models: DynamicFormModel): void {
    this.ngFormSettings = new DynamicNGFormSettings();
  }

  protected createDocumentForm(models: DynamicFormModel): void {
    this.formGroup = this.createFormGroup(this.ngFormSettings.formModel);
    const subscription = this.formGroup.statusChanges.subscribe((valid: any) => {
      timer(0).subscribe(() => { this.updateFormStatus({ formValid: valid === 'VALID', submitted: false }); });
    });
    this.subscription.add(subscription);
  }

  protected onDocumentChanged(): void {
    const subscription = combineLatest([
      this.document$,
      this.currentUser$,
      this.formSettings$,
    ]).subscribe(([doc, user, settings]: [DocumentModel, UserModel, DocumentFormSettings]) => {
      this.loading = false;
      this.setFormDocument(doc, user, settings);
      this.performDocumentForm(doc, user, settings);
    });
    this.subscription.add(subscription);
  }

  protected setFormDocument(doc: DocumentModel, user: UserModel, settings: DocumentFormSettings): void {
    this.currentUser = user;
    this.currentDocument = doc;
    this.formSettings = settings;
    this.formName = settings.formName || this.formName;
  }

  protected getFormValue(field?: string): any {
    return field ? this.formGroup.value[field] : this.formGroup.value;
  }

  protected getUploadFiles(uploadModel: DynamicFormControlModel): NuxeoUploadResponse[] {
    return uploadModel ? (this.getFormValue(uploadModel.field) || []).filter((res: NuxeoUploadResponse) => !res.original) : [];
  }

  protected getUploadName(model: DynamicFormControlModel): string {
    if (model instanceof DynamicBatchUploadModel) {
      return 'BatchUpload';
    } else if (model instanceof DynamicGalleryUploadModel) {
      return 'GalleryUpload';
    }
  }

  protected create(): void {
    let documents = [];
    if (this.formStatus$.value.uploadState === 'prepared') {
      if (this.getUploadFiles(this.uploadModel).length > 0) {
        this.formService.triggerEvent({ name: this.getUploadName(this.uploadModel), type: 'FileUpload', data: {} });
      }
    } else {
      this.currentDocument.properties = this.prepareProperties(this.currentDocument.properties, this.getFormValue());
      if (this.formStatus$.value.uploadState === 'uploaded') {
        documents = this.attachUploadFiles(this.currentDocument, this.getUploadFiles(this.uploadModel));
      } else {
        documents = [this.currentDocument];
      }
      documents.forEach(doc => {
        if (!doc.properties['files:files'] || doc.properties['files:files'].length === 0) {
          delete doc.properties['files:files'];
        }
      });
      this.createDocuments(documents, this.currentUser, this.formSettings.actionOptions).subscribe((models: DocumentModel[]) => {
        this.callback.emit(new DocumentFormEvent({ action: 'Created', messageType: 'success', messageContent: 'Document has been created successfully!', doc: models[0], docs: models }));
        if (this.formSettings.resetFormAfterDone) {
          this.resetForm();
        }
      });
    }
  }

  protected update(): void {
    if (this.formStatus$.value.uploadState === 'prepared') {
      if (this.getUploadFiles(this.uploadModel).length > 0) {
        this.formService.triggerEvent({ name: this.getUploadName(this.uploadModel), type: 'FileUpload', data: {} });
      }
    } else {
      let properties = this.prepareProperties({}, this.getFormValue());
      if (this.formStatus$.value.uploadState === 'uploaded') {
        const files = this.getUploadFiles(this.uploadModel);
        properties = this.updateUploadFiles(properties, files);
      }

      if (this.currentDocument.properties['nxtag:tags'] && properties['nxtag:tags']) {
        this.currentDocument.properties['nxtag:tags'] = properties['nxtag:tags'];
      }

      this.updateDocument(this.currentDocument, properties, this.currentUser, this.formSettings.actionOptions).subscribe((model: DocumentModel) => {
        this.callback.emit(new DocumentFormEvent({ action: 'Updated', messageType: 'success', messageContent: 'Document has been updated successfully!', doc: model }));
      });
    }
  }

  protected createDocuments(documents: DocumentModel[], user: UserModel, opts: any = {}): Observable<DocumentModel[]> {
    return forkJoin(documents.map(x => this.createDocument(x, user, opts)));
  }

  protected createDocument(doc: DocumentModel, user: UserModel, opts: any = {}): Observable<any> {
    return this.documentPageService.createDocument(this.beforeSave(doc, user), opts).pipe(
      concatMap((newDoc: DocumentModel) => this.afterSave(newDoc, user)),
      tap(_ => { this.updateFormStatus({ submitting: false, submitted: true }); }),
    );
  }

  protected updateDocument(doc: DocumentModel, properties: any = {}, user: UserModel, opts: any = {}): Observable<DocumentModel> {
    const updateDoc = this.beforeSave(doc, user);
    if (properties['nxtag:tags'] && updateDoc.properties['nxtag:tags']) {
      properties['nxtag:tags'] = updateDoc.properties['nxtag:tags'];
    }
    return updateDoc.set(properties).save(opts).pipe(
      concatMap((newDoc: DocumentModel) => this.afterSave(newDoc, user)),
      tap(_ => { this.updateFormStatus({ submitting: false, submitted: true }); }),
    );
  }

  protected newDocumentModel(doc: DocumentModel, properties: any = {}): DocumentModel {
    const list: string[] = ['title', 'uid', 'path', 'type', '_properties'];
    const keys: string[] = Object.keys(doc);
    for (const key of keys) {
      if (!list.includes(key)) {
        delete doc[key];
      }
    }
    if (!isValueEmpty(properties)) {
      doc.properties = Object.assign({}, doc.properties, properties);
    }
    return new DocumentModel(deepExtend({}, doc, properties));
  }

  protected attachUploadFiles(doc: DocumentModel, files: NuxeoUploadResponse[]): DocumentModel[] {
    return files.filter((res: NuxeoUploadResponse) => res.isMainFile()).map((res: NuxeoUploadResponse) => {
      let model: DocumentModel;
      if (this.uploadModel.settings.enableForm) {
        if (res.document) {
          res.document.properties = this.prepareProperties(res.document.properties, this.getFormValue());
          model = res.document;
        } else if (!isValueEmpty(res.attributes)) {
          model = this.newDocumentModel(doc, res.attributes);
        }
      } else {
        model = this.newDocumentModel(doc);
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
      this.onUploadFileSelected(this.uploadModel, this.ngFormSettings, added);
    } else if (added.some((res: NuxeoUploadResponse) => !res.uploaded && res.kbLoaded > 0)) {
      this.updateFormStatus({ uploadState: 'uploading' });
    } else if (added.every((res: NuxeoUploadResponse) => res.uploaded && res.kbLoaded > 0)) {
      this.updateFormStatus({ uploadState: 'uploaded' });
      this.onSave();
    }
    this.uploadCount = added.length;
  }

  protected onUploadFileSelected(uploadModel: DynamicFormControlModel, settings: DynamicNGFormSettings, res: NuxeoUploadResponse[]): void {

  }

  protected performUploadModel(settings: DynamicNGFormSettings, type: string): void {
    if (!this.uploadModel) {
      switch (type) {
        case 'BATCH_UPLOAD':
          this.uploadModel = settings.formModel.find((v) => (v instanceof DynamicBatchUploadModel));
          break;
        case 'GALLERY_UPLOAD':
          this.uploadModel = settings.formModel.find((v) => (v instanceof DynamicGalleryUploadModel));
          break;
      }
    }
  }

  protected performSwitchUploadModel(models: DynamicFormControlModel[]): void {
    this.updateFormStatus({ uploadState: null });
    this.uploadModel = models.find((x: any) => x.type.includes('UPLOAD'));
  }

  protected filterFileName(name: string): string {
    return name.replace(/_/g, ' ').replace(/\s+/g, ' ').replace(/\.\w+$/, '');
  }

  protected resetForm(): void {
    this.formGroup.reset();
  }

}
