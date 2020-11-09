import { Component, OnInit, Input, OnDestroy, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { deepExtend, isValueEmpty } from '@core/services/helpers';
import { DocumentFormEvent, DocumentFormSettings, DocumentFormStatus } from './document-form.interface';
import { Observable, of as observableOf, forkJoin, Subject, Subscription, combineLatest, BehaviorSubject, timer } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { UserModel, DocumentModel, DocumentRepository, NuxeoUploadResponse } from '@core/api';
import { DynamicFormService, DynamicFormControlModel, DynamicBatchUploadModel, DynamicFormModel, DynamicListModel } from '@core/custom';
import { DynamicNGFormSettings } from '../document-form-extension/dynamic-ng-form';

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

  private uploadFieldName: string;

  private user: UserModel;

  private documentModel: DocumentModel;

  protected subscription: Subscription = new Subscription();

  private document$: Subject<DocumentModel> = new Subject<DocumentModel>();

  private currentUser$: Subject<UserModel> = new Subject<UserModel>();

  private formSettings$: Subject<DocumentFormSettings> = new Subject<DocumentFormSettings>();

  private fileMultiUpload: boolean;

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

  constructor(private formService: DynamicFormService, private documentRepository: DocumentRepository) {
    this.onDocumentChanged();
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onBlur(event: any): void {
    // console.log(`BLUR event on ${event.model.field}: `, event);
  }

  onChange(event: any): void {
    // console.log(`CHANGE event on ${event.model.field}: `, event);
  }

  onFocus(event: any): void {
    // console.log(`FOCUS event on ${event.model.field}: `, event);
  }

  onCustomEvent(event: any): void {
    if (event.type === 'VALID') {
      this.updateFormStatus({ childrenValid: event.$event });
    }
    if (['BATCH_UPLOAD', 'GALLERY_UPLOAD'].includes(event.type)) {
      this.performBatchUpload(event.$event);
      // this.callback.emit(new DocumentFormEvent({ action: 'UploadFilesChanged', uploadType: event.type, status: this.formStatus$.value, doc: this.documentModel, ngFormSettings: this.ngFormSettings }));
    }

    if (event.type === 'SWITCH_TAB_CHANGED') {
      this.callback.emit(new DocumentFormEvent({ action: 'SwitchTabChanged', tabs: event.tabs, selected: event.selected, model: event.model, status: this.formStatus$.value, doc: this.documentModel }));
    }
  }

  onSave(event?: any): void {
    if (this.formSettings.formMode === 'create') {
      this.save();
    } else if (this.formSettings.formMode === 'edit') {
      this.update();
    }
  }

  onCancel(event: any): void {
    this.callback.emit(new DocumentFormEvent({ action: 'Canceled', doc: this.documentModel }));
    if (this.formSettings.resetFormAfterDone) {
      this.resetForm();
    }
  }

  onCustomButton(button: any): void {
    this.callback.emit(new DocumentFormEvent({ action: 'CustomButtonClicked', button: button.name, doc: this.documentModel }));
    if (button.triggerSave) {
      this.onSave();
    }
  }

  hideControls(): void {
    if (this.formSettings.formMode === 'create') {
      const type = this.fileMultiUpload ? 'delete' : 'show';
      this.modelOperation.next({ model: 'dc:title', type });
    }
  }

  setDocumentTitle(res: NuxeoUploadResponse): void {
    if (this.formSettings.formMode === 'create' && !this.fileMultiUpload && !this.formGroup.value['dc:title']) {
      this.formGroup.patchValue({ 'dc:title': this.filterFileName(res.fileName) });
    }
  }

  showAfterUploadMessage(): boolean {
    return this.formStatus$.value.uploadState === 'uploaded' && this.formSettings.formMode === 'create' && this.formSettings.showUploadMessage;
  }

  private updateFormStatus(status: any = {}): void {
    this.formStatus$.next(this.formStatus$.value.update(status));
  }

  private checkFiles(doc: DocumentModel): DocumentModel {
    const files = doc.get('files:files');
    let flag = false;
    if (!!files) {
      files.forEach(file => {
        if (!file.file) {
          flag = true;
        }
      });
    }
    if (flag) {
      doc.set({ 'files:files': [] });
    }
    return doc;
  }

  private filterPropertie(formValue: any = {}): any {
    const properties = deepExtend({}, formValue);
    Object.keys(properties).forEach((key: string) => {
      if (!key.includes(':')) { delete properties[key]; }
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

  private prepareModelSettings(models: DynamicFormModel): DynamicFormModel {
    const uploadModel = models.find((v) => (v instanceof DynamicBatchUploadModel));
    this.uploadFieldName = uploadModel ? uploadModel.field : this.uploadFieldName;
    const model = models.find(m => (m instanceof DynamicBatchUploadModel) && m.formMode === 'create');
    this.fileMultiUpload = model ? (model as any).multiUpload : false;
    return models.filter((v) => v.formMode === null || v.formMode === this.formSettings.formMode);
  }

  private prepareFormModel(doc: DocumentModel, user: UserModel, settings: DocumentFormSettings, formModel: DynamicFormModel): DynamicFormModel {
    formModel.forEach((model: DynamicFormControlModel) => {
      const modelValue = doc.get(model.field);
      if (model.hiddenFn) { model.hidden = model.hiddenFn(doc, user, settings); }
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
        this.prepareFormModel(doc, user, settings, model.items);
      }
    });
    return formModel;
  }

  private performFormModel(doc: DocumentModel, user: UserModel, settings: DocumentFormSettings): DynamicFormModel {
    let models = settings.formModel.filter((m: DynamicFormControlModel) => !m.visibleFn || m.visibleFn(doc, user, settings));
    models = this.prepareModelSettings(models);
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
    ngFormSettings.formLayout = settings.formLayout;
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

  private save(): void {
    let documents = [];
    this.documentModel.properties = this.filterPropertie(this.formGroup.value);
    if (this.formStatus$.value.uploadState === 'uploaded') {
      documents = this.attachFiles(this.documentModel, this.formGroup.value[this.uploadFieldName]);
    } else {
      documents = [this.documentModel];
      documents.forEach(doc => {
        if (doc.properties['files:files'] === null) {
          delete doc.properties['files:files'];
        }
      });
    }
    this.createDocuments(documents, this.user).subscribe((models: DocumentModel[]) => {
      this.updateFormStatus({ submitted: true });
      this.callback.next(new DocumentFormEvent({ action: 'Created', messageType: 'success', messageContent: 'Document has been created successfully!', doc: models[0], docs: models }));
      if (this.formSettings.resetFormAfterDone) {
        this.resetForm();
      }
    });
  }

  private update(): void {
    let properties = this.filterPropertie(this.formGroup.value);
    if (this.formStatus$.value.uploadState === 'uploaded') {
      properties = this.updateAttachedFiles(properties);
      if (properties['files:files'] === null) {
        delete properties['files:files'];
      }
    }

    if (this.documentModel.properties['nxtag:tags'] && properties['nxtag:tags']) {
      this.documentModel.properties['nxtag:tags'] = properties['nxtag:tags'];
    }

    this.updateDocument(this.documentModel, properties, this.user).subscribe((model: DocumentModel) => {
      this.updateFormStatus({ submitted: true });
      this.callback.next(new DocumentFormEvent({ action: 'Updated', messageType: 'success', messageContent: 'Document has been updated successfully!', doc: model }));
    });
  }

  private createDocuments(documents: DocumentModel[], user: UserModel): Observable<DocumentModel[]> {
    return forkJoin(documents.map(x => this.createDocument(x, user)));
  }

  private createDocument(doc: DocumentModel, user: UserModel): Observable<any> {
    return this.documentRepository.create(this.beforeSave(doc, user)).pipe(
      concatMap((newDoc: DocumentModel) => this.afterSave(newDoc, user)),
    );
  }

  private updateDocument(doc: DocumentModel, properties: any = {}, user: UserModel): Observable<DocumentModel> {
    const updateDoc = this.beforeSave(doc, user);
    if (properties['nxtag:tags'] && updateDoc.properties['nxtag:tags']) {
      properties['nxtag:tags'] = updateDoc.properties['nxtag:tags'];
    }
    return updateDoc.set(properties).save().pipe(
      concatMap((newDoc: DocumentModel) => this.afterSave(newDoc, user)),
    );
  }

  private attachFiles(doc: DocumentModel, files: NuxeoUploadResponse[]): DocumentModel[] {
    return files.map((res: NuxeoUploadResponse) => {
      const model = this.newDocumentModel(doc).attachBatchBlob(res.batchBlob);
      if (!!res.title && this.fileMultiUpload) {
        model.properties['dc:title'] = res.title;
      }
      delete model.properties['files:files'];
      return model;
    });
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

  private updateAttachedFiles(properties: any): any {
    const attachmens = [];
    const files = this.formGroup.value[this.uploadFieldName];
    files.forEach((file: NuxeoUploadResponse) => {
      if (file.uploadFileType === 'asset') {
        properties['file:content'] = file.batchBlob;
      }
      if (file.uploadFileType === 'attachment') {
        attachmens.push({ file: file.batchBlob });
      }
    });
    if (attachmens.length > 0) {
      properties['files:files'] = attachmens;
    } else {
      delete properties['files:files'];
    }
    return properties;
  }

  private performBatchUpload(list: NuxeoUploadResponse[]): void {
    if (list.length === 0) {
      this.updateFormStatus({ uploadState: null });
    } else if (list.every((res: NuxeoUploadResponse) => !res.uploaded && res.kbLoaded === 0)) {
      this.updateFormStatus({ uploadState: 'preparing' });
    } else if (list.some((res: NuxeoUploadResponse) => !res.uploaded && res.kbLoaded > 0)) {
      this.updateFormStatus({ uploadState: 'uploading' });
    } else if (list.every((res: NuxeoUploadResponse) => res.uploaded && res.kbLoaded > 0)) {
      this.hideControls();
      this.setDocumentTitle(list[0]);
      this.updateFormStatus({ uploadState: 'uploaded' });
    }
    this.uploadCount = list.length;
  }

  private performGalleryUpload(list: NuxeoUploadResponse[]): void {
    console.log(1111, list);
  }

  private filterFileName(name: string): string {
    return name.replace(/_/g, ' ').replace(/\s+/g, ' ').replace(/\.\w+$/, '');
  }

  private resetForm(): void {
    this.formGroup.reset();
  }

}
