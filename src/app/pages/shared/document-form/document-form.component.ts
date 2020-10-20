import { Component, OnInit, Input, OnDestroy, EventEmitter, Output, ViewChildren, TemplateRef, QueryList } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { deepExtend, objHasValue } from '@core/services/helpers';
import { DocumentFormEvent, DocumentFormSettings, DocumentFormStatus } from './document-form.interface';
import { Observable, of as observableOf, forkJoin, Subject, Subscription, combineLatest, BehaviorSubject, timer } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { UserModel, DocumentModel, DocumentRepository, NuxeoUploadResponse } from '@core/api';
import { DynamicFormService, DynamicFormControlModel, DynamicBatchUploadModel, DynamicFormLayout, DynamicFormModel, DynamicListModel } from '@core/custom';

@Component({
  selector: 'document-form',
  styleUrls: ['./document-form.component.scss'],
  templateUrl: './document-form.component.html',
})
export class DocumentFormComponent implements OnInit, OnDestroy {

  @ViewChildren(TemplateRef) buttonTemplates: QueryList<TemplateRef<any>>;

  formModel: DynamicFormModel;

  formLayout: DynamicFormLayout;

  accordionList: any[] = [];

  formGroup: FormGroup;

  modelOperation: Subject<{ id: string, type: string }> = new Subject();

  uploadCount: number = 0;

  formSettings: DocumentFormSettings = new DocumentFormSettings();

  formStatus$: BehaviorSubject<DocumentFormStatus> = new BehaviorSubject<DocumentFormStatus>(new DocumentFormStatus());

  private uploadFieldName: string;

  private documentModel: DocumentModel;

  protected subscription: Subscription = new Subscription();

  private document$: Subject<DocumentModel> = new Subject<DocumentModel>();

  private models$: Subject<DynamicFormModel> = new Subject<DynamicFormModel>();

  private formSettings$: Subject<DocumentFormSettings> = new Subject<DocumentFormSettings>();

  private fileMultiUpload: boolean;


  @Input()
  set document(doc: DocumentModel) {
    if (doc) {
      doc = this.checkfiles(doc);
      this.document$.next(doc);
    }
  }

  @Input()
  set settings(settings: DocumentFormSettings) {
    if (objHasValue(settings)) {
      this.formSettings$.next(settings);
    }
  }

  @Input()
  set models(models: DynamicFormModel) {
    if (objHasValue(models)) {
      this.models$.next(models);
    }
  }

  @Input()
  set layout(layout: any) {
    this.formLayout = layout;
  }

  @Input() dynamicModelIndex: number[] = [];

  @Input() accordion: any[] = [];

  @Input() loading: boolean = true;

  @Input() currentUser: UserModel;

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
    // console.log(`BLUR event on ${event.model.id}: `, event);
  }

  onChange(event: any): void {
    // console.log(`CHANGE event on ${event.model.id}: `, event);
  }

  onFocus(event: any): void {
    // console.log(`FOCUS event on ${event.model.id}: `, event);
  }

  onCustomEvent(event: any): void {
    if (event.type === 'VALID') {
      this.updateFormStatus({ childrenValid: event.$event });
    }
    if (event.type === 'BATCH_UPLOAD') {
      this.performUploading(event.$event);
    }
  }

  onSave(event: any): void {
    if (this.formSettings.formMode === 'create') {
      this.save();
    } else if (this.formSettings.formMode === 'edit') {
      this.update();
    }
  }

  onCancel(event: any): void {
    this.callback.emit(new DocumentFormEvent({ action: 'Canceled', messageType: 'info', doc: this.documentModel }));
    if (this.formSettings.resetFormAfterDone) {
      this.resetForm();
    }
  }

  onCustomButton(button: any): void {
    this.callback.emit(new DocumentFormEvent({ action: 'CustomButtonClicked', messageType: 'info', button: button.name, doc: this.documentModel }));
  }

  hideControls(): void {
    if (this.formSettings.formMode === 'create') {
      const type = this.fileMultiUpload ? 'delete' : 'show';
      this.modelOperation.next({ id: 'dc:title', type });
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

  private checkfiles(doc: DocumentModel): DocumentModel {
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

  private performAccordion(doc: DocumentModel, settings: DocumentFormSettings, accordion: any = []): void {
    this.accordionList = (accordion || []).filter((item: any) => !item.visibleFn || item.visibleFn(doc, this.currentUser, settings));
  }

  private prepareModelSettings(models: DynamicFormModel): DynamicFormModel {
    const uploadModel = models.find((v) => (v instanceof DynamicBatchUploadModel));
    this.uploadFieldName = uploadModel ? uploadModel.id : this.uploadFieldName;
    const model = models.find(m => (m instanceof DynamicBatchUploadModel) && m.formMode === 'create');
    this.fileMultiUpload = model ? (model as any).multiUpload : false;
    return models.filter((v) => v.formMode === null || v.formMode === this.formSettings.formMode);
  }

  private performFormModels(doc: DocumentModel, settings: DocumentFormSettings, formModels: DynamicFormModel): DynamicFormModel {
    formModels.forEach((model: DynamicFormControlModel) => {
      const modelValue = doc.get(model.id);
      if (model.hiddenFn) { model.hidden = model.hiddenFn(doc, this.currentUser, settings); }
      if (model.document) { model.document = doc; }
      model.value = (!!model.defaultValue && !modelValue) ? model.defaultValue : modelValue;
      if (model instanceof DynamicListModel) {
        this.performFormModels(doc, settings, model.items);
      }
    });
    return formModels;
  }

  private prepareForm(doc: DocumentModel, settings: DocumentFormSettings, formModels: DynamicFormModel): void {
    if (doc) {
      formModels = formModels.filter((m: DynamicFormControlModel) => !m.visibleFn || m.visibleFn(doc, this.currentUser, settings));
      let models = this.prepareModelSettings(formModels);
      models = this.performFormModels(doc, settings, models);
      this.createForm(models);
    }
  }

  private createForm(models: DynamicFormModel): void {
    this.formModel = this.createFormModel(models);
    this.formGroup = this.createFormGroup(this.formModel);
    const subscription = this.formGroup.statusChanges.subscribe((valid: any) => {
      timer(0).subscribe(() => { this.updateFormStatus({ formValid: valid === 'VALID', submitted: false }); });
    });
    this.subscription.add(subscription);
  }

  private onDocumentChanged(): void {
    const subscription = combineLatest([
      this.document$,
      this.models$,
      this.formSettings$,
    ]).subscribe(([doc, models, settings]: [DocumentModel, DynamicFormModel, DocumentFormSettings]) => {
      this.loading = false;
      this.documentModel = doc;
      this.formSettings = settings;
      this.performAccordion(doc, settings, this.accordion);
      this.prepareForm(doc, settings, models);
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
    this.createDocuments(documents).subscribe((models: DocumentModel[]) => {
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

    this.updateDocument(this.documentModel, properties).subscribe((model: DocumentModel) => {
      this.updateFormStatus({ submitted: true });
      this.callback.next(new DocumentFormEvent({ action: 'Updated', messageType: 'success', messageContent: 'Document has been updated successfully!', doc: model }));
    });
  }

  private createDocuments(documents: DocumentModel[]): Observable<DocumentModel[]> {
    return forkJoin(documents.map(x => this.createDocument(x)));
  }

  private createDocument(doc: DocumentModel): Observable<any> {
    return this.documentRepository.create(this.beforeSave(doc, this.currentUser)).pipe(
      concatMap((newDoc: DocumentModel) => this.afterSave(newDoc, this.currentUser)),
    );
  }

  private updateDocument(doc: DocumentModel, properties: any = {}): Observable<DocumentModel> {
    const updateDoc = this.beforeSave(doc, this.currentUser);
    if (properties['nxtag:tags'] && updateDoc.properties['nxtag:tags']) {
      properties['nxtag:tags'] = updateDoc.properties['nxtag:tags'];
    }
    return updateDoc.set(properties).save().pipe(
      concatMap((newDoc: DocumentModel) => this.afterSave(newDoc, this.currentUser)),
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

  private performUploading(list: NuxeoUploadResponse[]): void {
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

  private filterFileName(name: string): string {
    return name.replace(/_/g, ' ').replace(/\s+/g, ' ').replace(/\.\w+$/, '');
  }

  private resetForm(): void {
    this.formGroup.reset();
  }

}
