import { Component, OnInit, Input, OnDestroy, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { deepExtend, isValueEmpty } from '@core/services/helpers';
import { DynamicNGFormSettings } from '../document-form-extension/dynamic-ng-form';
import { UserModel, DocumentModel, AdvanceSearchService, NuxeoUploadResponse } from '@core/api';
import { DocumentFormEvent, DocumentFormSettings, DocumentFormStatus } from './document-form.interface';
import { DynamicFormService, DynamicFormControlModel, DynamicBatchUploadModel, DynamicGalleryUploadModel, DynamicFormModel, DynamicListModel } from '@core/custom';
import { Observable, of as observableOf, forkJoin, Subject, Subscription, combineLatest, BehaviorSubject, timer } from 'rxjs';
import { concatMap, tap } from 'rxjs/operators';

@Component({
  selector: 'document-form',
  styleUrls: ['./document-form.component.scss'],
  templateUrl: './document-form.component.html',
})
export class DocumentFormComponent implements OnInit, OnDestroy {

  formGroup: FormGroup;

  modelOperation: Subject<{ model: string, type: string }> = new Subject();

  uploadCount: number = 0;

  ngFormSettings: DynamicNGFormSettings;

  formSettings: DocumentFormSettings = new DocumentFormSettings();

  formStatus$: BehaviorSubject<DocumentFormStatus> = new BehaviorSubject<DocumentFormStatus>(new DocumentFormStatus());

  private user: UserModel;

  private documentModel: DocumentModel;

  private uploadModel: DynamicFormControlModel;

  private subscription: Subscription = new Subscription();

  private document$: Subject<DocumentModel> = new Subject<DocumentModel>();

  private currentUser$: Subject<UserModel> = new Subject<UserModel>();

  private formSettings$: Subject<DocumentFormSettings> = new Subject<DocumentFormSettings>();

  @Input()
  set document(doc: DocumentModel) {
    if (doc) {
      this.document$.next(this.checkFiles(doc));
    }
  }

  @Input()
  set settings(settings: DocumentFormSettings) {
    if (!isValueEmpty(settings)) {
      this.formSettings$.next(settings);
    }
  }

  @Input()
  set currentUser(user: UserModel) {
    if (!isValueEmpty(user)) {
      this.currentUser$.next(user);
    }
  }

  @Input() loading: boolean = true;

  @Output() callback: EventEmitter<DocumentFormEvent> = new EventEmitter<DocumentFormEvent>();

  @Input() beforeSave: (doc: DocumentModel, user: UserModel) => DocumentModel = (doc: DocumentModel, user: UserModel) => doc;

  @Input() afterSave: (doc: DocumentModel, user: UserModel) => Observable<DocumentModel> = (doc: DocumentModel, user: UserModel) => observableOf(doc);

  constructor(private formService: DynamicFormService, private advanceSearchService: AdvanceSearchService) {
    this.onDocumentChanged();
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onBlur(event: any): void {
    // console.log(`BLUR event on ${event.model.field}: `, event);
    this.callback.emit(new DocumentFormEvent({ action: 'onBlur', status: this.formStatus$.value, formValue: this.getFormValue(), doc: this.documentModel, ngFormSettings: this.ngFormSettings }));
  }

  onChange(event: any): void {
    // console.log(`CHANGE event on ${event.model.field}: `, event);
  }

  onFocus(event: any): void {
    // console.log(`FOCUS event on ${event.model.field}: `, event);
  }

  onCustomEvent(event: any): void {
    if (event.type === 'VALID') {
      this.updateFormStatus({ childrenValid: event.$event.response });
    }
    if (['BATCH_UPLOAD', 'GALLERY_UPLOAD'].includes(event.type)) {
      this.performBatchUpload(event);
      this.callback.emit(new DocumentFormEvent({
        action: 'UploadFilesChanged',
        actionType: event.$event.type,
        uploadType: event.type,
        doc: this.documentModel,
        status: this.formStatus$.value,
        formValue: this.getFormValue(),
        ngFormSettings: this.ngFormSettings,
      }));
    }
    if (event.type === 'SWITCH_TAB_CHANGED') {
      this.performSwitchUploadModel(event.model);
      this.callback.emit(new DocumentFormEvent({ action: 'SwitchTabChanged', tabs: event.tabs, selected: event.selected, model: event.model, status: this.formStatus$.value, formValue: this.getFormValue(), doc: this.documentModel }));
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
    this.callback.emit(new DocumentFormEvent({ action: 'Canceled', doc: this.documentModel }));
    if (this.formSettings.resetFormAfterDone) {
      this.resetForm();
    }
  }

  onCustomButton(button: any): void {
    this.callback.emit(new DocumentFormEvent({ action: 'CustomButtonClicked', button: button.name, formValue: this.getFormValue(), doc: this.documentModel }));
    if (button.triggerSave) {
      this.onSave();
    }
  }

  hideControls(uploadModel: DynamicFormControlModel, settings: DynamicNGFormSettings): void {
    if (settings.formMode === 'create') {
      const type = uploadModel.settings.enableInput ? 'delete' : 'show';
      this.modelOperation.next({ model: 'dc:title', type });
    }
  }

  setDocumentTitle(uploadModel: DynamicFormControlModel, settings: DynamicNGFormSettings, res: NuxeoUploadResponse): void {
    if (settings.formMode === 'create' && !uploadModel.settings.enableInput && !this.getFormValue('dc:title')) {
      this.formGroup.patchValue({ 'dc:title': this.filterFileName(res.fileName) });
    }
  }

  showMessageAfterUpload(): boolean {
    return !this.formStatus$.value.submitting && this.formStatus$.value.uploadState === 'uploaded' && this.formSettings.formMode === 'create' && this.formSettings.showUploadMessage;
  }

  showMessageBeforeSuccess(): boolean {
    return this.formStatus$.value.submitting && this.formSettings.showMessageBeforeSave;
  }

  private updateFormStatus(status: any = {}): void {
    this.formStatus$.next(this.formStatus$.value.update(status));
  }

  private checkFiles(doc: DocumentModel): DocumentModel {
    const files = doc.get('files:files') || [];
    if (files.every((f: any) => !f.file)) {
      doc.set({ 'files:files': [] });
    }
    return doc;
  }

  private filterPropertie(props: any = {}, formValue: any = {}): any {
    const properties = deepExtend({}, props, formValue);
    Object.keys(properties).forEach((key: string) => {
      if (!key.includes(':') || ['file:content', 'files:files'].includes(key)) { delete properties[key]; }
    });
    return properties;
  }

  private createFormModel(settings: string | any[]): DynamicFormModel {
    return this.formService.fromJSON(settings);
  }

  private createFormGroup(formModel: DynamicFormModel): FormGroup {
    return this.formService.createFormGroup(formModel);
  }

  private prepareAccordionTab(doc: DocumentModel, user: UserModel, settings: DocumentFormSettings, models: DynamicFormModel): any[] {
    const accordionSettings = (settings.accordionSettings || []).filter((item: any) => !item.visibleFn || item.visibleFn(doc, user, settings));
    return accordionSettings.map((s: { name: string, position: string }) => ({ name: s.name, position: s.position, models: models.filter(m => m.accordionTab === s.name) }));
  }

  private prepareSwitchTab(doc: DocumentModel, user: UserModel, settings: DocumentFormSettings, models: DynamicFormModel): any[] {
    const tabSettings = (settings.switchTabSettings || []).filter((item: any) => !item.visibleFn || item.visibleFn(doc, user, settings));
    return tabSettings.map((s: { name: string, active: boolean, disabledFn?: any }) => ({ name: s.name, active: s.active, disabled: (s.disabledFn && s.disabledFn(doc, user, settings)), models: models.filter(m => m.switchTab === s.name) }));
  }

  private prepareFormModel(doc: DocumentModel, user: UserModel, settings: DocumentFormSettings, formModel: DynamicFormModel): DynamicFormModel {
    formModel.forEach((model: DynamicFormControlModel) => {
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
        this.prepareFormModel(doc, user, settings, model.settings.items);
      }
    });
    return formModel;
  }

  private performFormModel(doc: DocumentModel, user: UserModel, settings: DocumentFormSettings): DynamicFormModel {
    const models = settings.formModel.filter((v) => v.formMode === null || v.formMode === settings.formMode).filter((m: DynamicFormControlModel) => !m.visibleFn || m.visibleFn(doc, user, settings));
    return this.prepareFormModel(doc, user, settings, models);
  }

  private performDocumentForm(doc: DocumentModel, user: UserModel, settings: DocumentFormSettings): void {
    const models = this.performFormModel(doc, user, settings);
    this.performNgFormSettings(doc, user, settings, models);
    this.createDocumentForm(models);
  }

  private performNgFormSettings(doc: DocumentModel, user: UserModel, settings: DocumentFormSettings, models: DynamicFormModel): void {
    const ngFormSettings = new DynamicNGFormSettings();
    ngFormSettings.accordionSettings = this.prepareAccordionTab(doc, user, settings, models);
    ngFormSettings.switchTabSettings = this.prepareSwitchTab(doc, user, settings, models);
    ngFormSettings.formModel = this.createFormModel(models);
    ngFormSettings.enableLayoutRight = settings.enableLayoutRight;
    ngFormSettings.formMode = settings.formMode;
    this.ngFormSettings = ngFormSettings;
  }

  private createDocumentForm(models: DynamicFormModel): void {
    this.formGroup = this.createFormGroup(this.ngFormSettings.formModel);
    const subscription = this.formGroup.statusChanges.subscribe((valid: any) => {
      timer(0).subscribe(() => { this.updateFormStatus({ formValid: valid === 'VALID', submitted: false }); });
    });
    this.subscription.add(subscription);
  }

  private onDocumentChanged(): void {
    const subscription = combineLatest([
      this.document$,
      this.currentUser$,
      this.formSettings$,
    ]).subscribe(([doc, user, settings]: [DocumentModel, UserModel, DocumentFormSettings]) => {
      this.loading = false;
      this.user = user;
      this.documentModel = doc;
      this.formSettings = settings;
      this.performDocumentForm(doc, user, settings);
    });
    this.subscription.add(subscription);
  }

  private getFormValue(field?: string): any {
    return field ? this.formGroup.value[field] : this.formGroup.value;
  }

  private getUploadFiles(uploadModel: DynamicFormControlModel): NuxeoUploadResponse[] {
    return uploadModel ? (this.getFormValue(uploadModel.field) || []).filter((res: NuxeoUploadResponse) => !res.original) : [];
  }

  private getUploadName(model: DynamicFormControlModel): string {
    if (model instanceof DynamicBatchUploadModel) {
      return 'BatchUpload';
    } else if (model instanceof DynamicGalleryUploadModel) {
      return 'GalleryUpload';
    }
  }

  private create(): void {
    let documents = [];
    this.documentModel.properties = this.filterPropertie(this.documentModel.properties, this.getFormValue());
    if (this.formStatus$.value.uploadState === 'prepared') {
      if (this.getUploadFiles(this.uploadModel).length > 0) {
        this.formService.triggerEvent({ name: this.getUploadName(this.uploadModel), type: 'FileUpload', data: {} });
      }
    } else {
      if (this.formStatus$.value.uploadState === 'uploaded') {
        documents = this.attachUploadFiles(this.documentModel, this.getUploadFiles(this.uploadModel));
      } else {
        documents = [this.documentModel];
      }
      documents.forEach(doc => {
        if (!doc.properties['files:files'] || doc.properties['files:files'].length === 0) {
          delete doc.properties['files:files'];
        }
      });
      this.createDocuments(documents, this.user, this.formSettings.actionOptions).subscribe((models: DocumentModel[]) => {
        this.callback.emit(new DocumentFormEvent({ action: 'Created', messageType: 'success', messageContent: 'Document has been created successfully!', doc: models[0], docs: models }));
        if (this.formSettings.resetFormAfterDone) {
          this.resetForm();
        }
      });
    }
  }

  private update(): void {
    let properties = this.filterPropertie(this.getFormValue());
    if (this.formStatus$.value.uploadState === 'prepared') {
      if (this.getUploadFiles(this.uploadModel).length > 0) {
        this.formService.triggerEvent({ name: this.getUploadName(this.uploadModel), type: 'FileUpload', data: {} });
      }
    } else {
      if (this.formStatus$.value.uploadState === 'uploaded') {
        const files = this.getUploadFiles(this.uploadModel);
        properties = this.updateUploadFiles(properties, files);
      }

      if (this.documentModel.properties['nxtag:tags'] && properties['nxtag:tags']) {
        this.documentModel.properties['nxtag:tags'] = properties['nxtag:tags'];
      }

      this.updateDocument(this.documentModel, properties, this.user, this.formSettings.actionOptions).subscribe((model: DocumentModel) => {
        this.callback.emit(new DocumentFormEvent({ action: 'Updated', messageType: 'success', messageContent: 'Document has been updated successfully!', doc: model }));
      });
    }
  }

  private createDocuments(documents: DocumentModel[], user: UserModel, opts: any = {}): Observable<DocumentModel[]> {
    return forkJoin(documents.map(x => this.createDocument(x, user, opts)));
  }

  private createDocument(doc: DocumentModel, user: UserModel, opts: any = {}): Observable<any> {
    return this.advanceSearchService.create(this.beforeSave(doc, user), opts).pipe(
      concatMap((newDoc: DocumentModel) => this.afterSave(newDoc, user)),
      tap(_ => { this.updateFormStatus({ submitting: false, submitted: true }); }),
    );
  }

  private updateDocument(doc: DocumentModel, properties: any = {}, user: UserModel, opts: any = {}): Observable<DocumentModel> {
    const updateDoc = this.beforeSave(doc, user);
    if (properties['nxtag:tags'] && updateDoc.properties['nxtag:tags']) {
      properties['nxtag:tags'] = updateDoc.properties['nxtag:tags'];
    }
    return updateDoc.set(properties).save(opts).pipe(
      concatMap((newDoc: DocumentModel) => this.afterSave(newDoc, user)),
      tap(_ => { this.updateFormStatus({ submitting: false, submitted: true }); }),
    );
  }

  private newDocumentModel(doc: DocumentModel): DocumentModel {
    const list: string[] = ['title', 'uid', 'path', 'type', '_properties'];
    const keys: string[] = Object.keys(doc);
    for (const key of keys) {
      if (!list.includes(key)) {
        delete doc[key];
      }
    }
    return new DocumentModel(deepExtend({}, doc));
  }

  private attachUploadFiles(doc: DocumentModel, files: NuxeoUploadResponse[]): DocumentModel[] {
    return files.filter((res: NuxeoUploadResponse) => res.isMainFile()).map((res: NuxeoUploadResponse) => {
      const model = this.newDocumentModel(doc);
      model.properties = this.updateUploadFiles(model.properties, res);
      model.properties = this.updateUploadFiles(model.properties, files.filter((r: NuxeoUploadResponse) => !r.isMainFile()));
      if (!!res.title && this.uploadModel.settings.enableInput) {
        model.properties['dc:title'] = res.title;
      }
      return model;
    });
  }

  private updateUploadFiles(properties: any, files: NuxeoUploadResponse | NuxeoUploadResponse[]): any {
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

  private performBatchUpload(event: any): void {
    const all: NuxeoUploadResponse[] = event.$event.response;
    const added: NuxeoUploadResponse[] = all.filter((res: NuxeoUploadResponse) => !res.original);
    if (added.length === 0 && all.length > 0) {
      //
    } else if (added.length === 0) {
      this.updateFormStatus({ uploadState: null });
    } else if (event.$event.type === 'FileSelected') {
      this.updateFormStatus({ uploadState: 'prepared' });
      this.performUploadModel(this.ngFormSettings, event.type);
      this.hideControls(this.uploadModel, this.ngFormSettings);
      this.setDocumentTitle(this.uploadModel, this.ngFormSettings, added[0]);
    } else if (added.some((res: NuxeoUploadResponse) => !res.uploaded && res.kbLoaded > 0)) {
      this.updateFormStatus({ uploadState: 'uploading' });
    } else if (added.every((res: NuxeoUploadResponse) => res.uploaded && res.kbLoaded > 0)) {
      this.updateFormStatus({ uploadState: 'uploaded' });
      this.onSave();
    }
    this.uploadCount = added.length;
  }

  private performUploadModel(settings: DynamicNGFormSettings, type: string): void {
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

  private performSwitchUploadModel(models: DynamicFormControlModel[]): void {
    this.updateFormStatus({ uploadState: null });
    this.uploadModel = models.find((x: any) => x.type.includes('UPLOAD'));
  }

  private filterFileName(name: string): string {
    return name.replace(/_/g, ' ').replace(/\s+/g, ' ').replace(/\.\w+$/, '');
  }

  private resetForm(): void {
    this.formGroup.reset();
  }

}
