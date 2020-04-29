import { Component, OnInit, Input, OnDestroy, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DocumentModel, DocumentRepository, NuxeoUploadResponse } from '@core/api';
import { DynamicFormService, DynamicFormControlModel, DynamicBatchUploadModel, DynamicFormLayout, DynamicFormModel, DynamicListModel } from '@core/custom';
import { Observable, forkJoin, Subject, Subscription } from 'rxjs';
import { deepExtend } from '@core/services/helpers';
import { DocumentFormEvent } from './document-form.interface';

@Component({
  selector: 'document-form',
  styleUrls: ['./document-form.component.scss'],
  templateUrl: './document-form.component.html',
})
export class DocumentFormComponent implements OnInit, OnDestroy {

  formModel: DynamicFormModel;

  formLayout: DynamicFormLayout;

  accordionList: any[] = [];

  formGroup: FormGroup;

  submitted: boolean = false;

  childrenValid: boolean = true;

  uploadState: 'preparing' | 'uploading' | 'uploaded' | null;

  modelOperation: Subject<{ id: string, type: string }> = new Subject();

  private uploadFieldName: string;

  private documentModel: DocumentModel;

  protected subscription: Subscription = new Subscription();

  private document$: Subject<DocumentModel> = new Subject<DocumentModel>();

  private fileMultiUpload: boolean;

  @Input() placeholder: string;

  @Input() formMode: 'create' | 'edit' = 'create';

  @Input() dynamicModelIndex: number[] = [];

  @Input() accordions: any[] = [];

  @Input() loading: boolean = true;

  @Input() settings: DynamicFormModel = [];

  @Input()
  set document(doc: DocumentModel) {
    if (doc) {
      doc = this.checkfiles(doc);
      this.document$.next(doc);
    }
  }

  @Input()
  set layout(layout: any) {
    this.formLayout = layout;
  }

  @Output() callback: EventEmitter<DocumentFormEvent> = new EventEmitter<DocumentFormEvent>();

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
      this.childrenValid = event.$event;
    }
    if (event.type === 'BATCH_UPLOAD') {
      this.performUploading(event.$event);
    }
  }

  onSave($event: any): void {
    if (this.formMode === 'create') {
      this.save();
    } else if (this.formMode === 'edit') {
      this.update();
    }
  }

  onCancel($event: any): void {
    this.callback.emit({ action: 'canceled', message: { type: 'info', content: '' }, doc: this.documentModel });
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
      if (!key.includes(':')) {
        delete properties[key];
      }
    });
    return properties;
  }

  private createFormModel(settings: string | any[]): DynamicFormModel {
    return this.formService.fromJSON(settings);
  }

  private createFormGroup(formModel: DynamicFormModel): FormGroup {
    return this.formService.createFormGroup(formModel);
  }

  private performAccordions(doc: DocumentModel, accordions: any = []): void {
    this.accordionList = (accordions || []).filter((item: any) => !item.visibleFn || item.visibleFn.call(this, doc));
  }

  private prepareSettings(settings: DynamicFormModel): DynamicFormModel {
    const uploadModel = settings.find((v) => (v instanceof DynamicBatchUploadModel));
    this.uploadFieldName = uploadModel ? uploadModel.id : this.uploadFieldName;
    const model = settings.find(m => (m instanceof DynamicBatchUploadModel) && m.formMode === 'create');
    this.fileMultiUpload = model ? (model as any).multiUpload : false;
    return settings.filter((v) => v.formMode === null || v.formMode === this.formMode);
  }

  private performSettings(doc: DocumentModel, settings: DynamicFormModel): DynamicFormModel {
    settings.forEach((model: DynamicFormControlModel) => {
      const modelValue = doc.get(model.id);
      if (model.hiddenFn) { model.hidden = model.hiddenFn.call(this, doc); }
      if (model.document) { model.document = doc; }
      model.value = (!!model.defaultValue && !modelValue) ? model.defaultValue : modelValue;
      if (model instanceof DynamicListModel) {
        this.performSettings(doc, model.items);
      }
    });
    return settings;
  }

  private prepareForm(doc: DocumentModel, settings: DynamicFormModel): void {
    if (doc) {
      settings = settings.filter((m: DynamicFormControlModel) => !m.visibleFn || m.visibleFn.call(this, doc));
      let models = this.prepareSettings(settings);
      models = this.performSettings(doc, models);
      this.createForm(models);
    }
  }

  private createForm(settings: DynamicFormModel): void {
    this.formModel = this.createFormModel(settings);
    this.formGroup = this.createFormGroup(this.formModel);
  }

  private onDocumentChanged(): void {
    const subscription = this.document$.pipe(
    ).subscribe((doc: DocumentModel) => {
      this.loading = false;
      this.documentModel = doc;
      this.performAccordions(doc, this.accordions);
      this.prepareForm(doc, this.settings);
    });
    this.subscription.add(subscription);
  }

  private save(): void {
    let documents = [];
    this.documentModel.properties = this.filterPropertie(this.formGroup.value);
    if (this.uploadState === 'uploaded') {
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
      this.callback.next({ action: 'created', message: { type: 'success', content: 'created successfully!' }, doc: models });
    });
  }

  private update(): void {
    let properties = this.filterPropertie(this.formGroup.value);
    if (this.uploadState === 'uploaded') {
      properties = this.updateAttachedFiles(properties);
      if (properties['files:files'] === null) {
        delete properties['files:files'];
      }
    }
    this.updateDocument(this.documentModel, properties).subscribe((model: DocumentModel) => {
      this.callback.next({ action: 'updated', message: { type: 'success', content: 'updated successfully!' }, doc: model });
    });
  }

  private createDocuments(documents: DocumentModel[]): Observable<DocumentModel[]> {
    return forkJoin(documents.map(x => this.createDocument(x)));
  }

  private createDocument(document: DocumentModel): Observable<DocumentModel> {
    return this.documentRepository.create(document);
  }

  private updateDocument(model: DocumentModel, properties: any = {}): Observable<DocumentModel> {
    return model.set(properties).save();
  }

  private attachFiles(doc: DocumentModel, files: NuxeoUploadResponse[]): DocumentModel[] {
    return files.map((res: NuxeoUploadResponse) => {
      const model = this.newDocumentModel(doc).attachBatchBlob(res.batchBlob);
      if (!!res.title) {
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
        attachmens.push({ 'file': file.batchBlob });
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
      this.uploadState = null;
    } else if (list.every((res: NuxeoUploadResponse) => !res.uploaded && res.kbLoaded === 0)) {
      this.uploadState = 'preparing';
    } else if (list.some((res: NuxeoUploadResponse) => !res.uploaded && res.kbLoaded > 0)) {
      this.uploadState = 'uploading';
    } else if (list.every((res: NuxeoUploadResponse) => res.uploaded && res.kbLoaded > 0)) {
      this.hideControls();
      this.setTitle(list[0]);
      this.uploadState = 'uploaded';
    }
  }

  hideControls(): void {
    if (this.formMode === 'create') {
      const type = this.fileMultiUpload ? 'delete' : 'hide';
      this.modelOperation.next({ id: 'dc:title', type: type });
    }
  }

  setTitle(res: NuxeoUploadResponse): void {
    if (this.formMode === 'create' && !this.fileMultiUpload && !this.formGroup.value['dc:title']) {
      const reg = /\.\w+$/;
      const title = res.fileName.replace(reg, '');
      this.formGroup.patchValue({ 'dc:title': title });
    }
  }
}
