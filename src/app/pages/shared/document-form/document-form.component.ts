import { Component, OnInit, Input, OnDestroy, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DocumentModel, DocumentRepository, NuxeoUploadResponse } from '@core/api';
import { DynamicFormService, DynamicFormControlModel, DynamicBatchUploadModel, DynamicFormLayout } from '@core/custom';
import { Observable, forkJoin, Subject, Subscription } from 'rxjs';
import { deepExtend } from '@core/services';

@Component({
  selector: 'document-form',
  styleUrls: ['./document-form.component.scss'],
  templateUrl: './document-form.component.html',
})
export class DocumentFormComponent implements OnInit, OnDestroy {

  formModel: DynamicFormControlModel[];

  formLayout: DynamicFormLayout;

  formGroup: FormGroup;

  submitted: boolean = false;

  childrenValid: boolean = true;

  uploadState: 'preparing' | 'uploading' | 'uploaded' | null;

  dynamicModels: DynamicFormControlModel[] = [];

  modelOperation: Subject<{ id: string, type: string }> = new Subject();

  private formMode: 'create' | 'edit';

  private uploadFieldName: string;

  private documentModel: DocumentModel;

  protected subscription: Subscription = new Subscription();

  private document$: Subject<DocumentModel> = new Subject<DocumentModel>();

  private fileMultiUpload: boolean;

  @Input() placeholder: string;

  @Input() dynamicModelIndex: number[] = [];

  @Input() accordions: any;

  @Input() loading: boolean = true;

  @Input() settings: DynamicFormControlModel[] = [];

  @Input()
  set document(doc: DocumentModel) {
    if (doc) {
      doc = this.checkfiles(doc);
      this.formMode = doc.uid ? 'edit' : 'create';
      this.document$.next(doc);
    }
  }

  @Input()
  set layout(layout: any) {
    this.formLayout = layout;
  }

  @Output() onCreated: EventEmitter<DocumentModel[]> = new EventEmitter<DocumentModel[]>();
  @Output() onUpdated: EventEmitter<DocumentModel> = new EventEmitter<DocumentModel>();
  @Output() onCanceled: EventEmitter<DocumentModel> = new EventEmitter<DocumentModel>();

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
    this.onCanceled.next(this.documentModel);
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

  private filterPropertie(formValue: any = {}) {
    const properties = deepExtend({}, formValue);
    Object.keys(properties).forEach((key: string) => {
      if (!key.includes(':')) {
        delete properties[key];
      }
    });
    return properties;
  }

  private createFormModel(settings: string | any[]): DynamicFormControlModel[] {
    return this.formService.fromJSON(settings);
  }

  private createFormGroup(formModel: DynamicFormControlModel[]): FormGroup {
    return this.formService.createFormGroup(formModel);
  }

  private performSettings(settings: DynamicFormControlModel[]): DynamicFormControlModel[] {
    const uploadModel = settings.find((v) => (v instanceof DynamicBatchUploadModel));
    this.uploadFieldName = uploadModel ? uploadModel.id : this.uploadFieldName;
    const model = settings.find(m => (m instanceof DynamicBatchUploadModel) && m.formMode === 'create');
    this.fileMultiUpload = model ? (model as any).multiUpload : false;
    return settings.filter((v) => v.formMode === null || v.formMode === this.formMode);
  }

  private createForm(settings: DynamicFormControlModel[]): void {
    this.formModel = this.createFormModel(settings);
    this.formGroup = this.createFormGroup(this.formModel);
  }

  private prepareForm(doc: DocumentModel, settings: DynamicFormControlModel[]) {
    if (doc) {
      const models = this.performSettings(settings);
      models.forEach((model: DynamicFormControlModel) => {
        const modelValue = doc.get(model.id);
        if (model.hiddenFn) { model.hidden = model.hiddenFn.call(this, doc); }
        if (model.document) { model.document = doc; }
        model.value = (!!model.defaultValue && !modelValue) ? model.defaultValue : modelValue;
      });
      this.createForm(models);
    }
  }

  private onDocumentChanged(): void {
    const subscription = this.document$.pipe(
    ).subscribe((doc: DocumentModel) => {
      this.loading = false;
      this.documentModel = doc;
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
    }
    this.createDocuments(documents).subscribe((models: DocumentModel[]) => {
      this.onCreated.next(models);
    });
  }

  private update(): void {
    let properties = this.filterPropertie(this.formGroup.value);
    if (this.uploadState === 'uploaded') {
      properties = this.updateAttachedFiles(properties);
    }
    this.updateDocument(this.documentModel, properties).subscribe((model: DocumentModel) => {
      this.onUpdated.next(model);
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
      const model = new DocumentModel(deepExtend({}, doc)).attachBatchBlob(res.batchBlob);
      if (!!res.title) {
        model.properties['dc:title'] = res.title;
      }
      delete model.properties['files:files'];
      return model;
    });
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
    if (this.formMode === 'create' && this.fileMultiUpload) {
      this.dynamicModelIndex.sort().forEach((modelIndex: number, index: number) => {
        this.modelOperation.next({ id: 'dc:title', type: 'delete' });
      });
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
