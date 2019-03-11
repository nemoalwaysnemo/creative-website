import { Component, OnInit, Input, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DocumentModel, DocumentRepository, NuxeoUploadResponse } from '@core/api';
import { DynamicFormService, DynamicFormControlModel, DynamicBatchUploadModel } from '@core/custom';
import { Subscription } from 'rxjs/Subscription';
import { filterParams } from '@core/services';
import { Observable, forkJoin } from 'rxjs';

@Component({
  selector: 'tbwa-document-form',
  styleUrls: ['./document-form.component.scss'],
  templateUrl: './document-form.component.html',
})
export class DocumentFormComponent implements OnInit, OnChanges, OnDestroy {

  formModel: DynamicFormControlModel[];

  formGroup: FormGroup;

  submitted: boolean = false;

  uploadState: 'preparing' | 'uploading' | 'uploaded' | null;

  private formSettings: any[];

  private formMode: 'create' | 'edit';

  private uploadFieldName: string;

  private subscription: Subscription = new Subscription();

  private documentModel: DocumentModel | DocumentModel;

  @Input() placeholder: string;

  @Input()
  set document(doc: DocumentModel | DocumentModel) {
    if (doc) {
      this.documentModel = doc;
      this.formMode = doc.uid ? 'edit' : 'create';
    }
  }

  @Input()
  set settings(settings: any[]) {
    if (settings) {
      this.formSettings = settings;
      this.createForm(settings);
    }
  }

  constructor(private formService: DynamicFormService, private documentRepository: DocumentRepository) {

  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {

  }

  ngOnDestroy() {

  }

  onBlur(event: any): void {
    console.log(`BLUR event on ${event.model.id}: `, event);
  }

  onChange(event: any): void {
    console.log(`CHANGE event on ${event.model.id}: `, event);
  }

  onFocus(event: any): void {
    console.log(`FOCUS event on ${event.model.id}: `, event);
  }

  onCustomEvent(event: any): void {
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

  private filterPropertie(formValue: any = {}) {
    const properties = filterParams(formValue);
    if (this.uploadFieldName && properties[this.uploadFieldName]) {
      delete properties[this.uploadFieldName];
    }
    return properties;
  }

  private createFormModel(settings: string | any[]): DynamicFormControlModel[] {
    return this.formService.fromJSON(settings);
  }

  private createFormGroup(formModel: DynamicFormControlModel[]): FormGroup {
    return this.formService.createFormGroup(formModel);
  }

  private performSettings(settings: DynamicFormControlModel[]): any[] {
    const uploadModel = settings.find((v) => v instanceof DynamicBatchUploadModel);
    this.uploadFieldName = uploadModel ? uploadModel.id : this.uploadFieldName;
    return settings.filter((v) => v.formMode === null || v.formMode === this.formMode);
  }

  private createForm(settings: DynamicFormControlModel[]): void {
    const opts = this.performSettings(settings);
    this.formModel = this.createFormModel(opts);
    this.formGroup = this.createFormGroup(this.formModel);
  }

  private save(): void {
    let documents = [];
    this.documentModel.properties = this.filterPropertie(this.formGroup.value);
    if (!this.uploadState || this.uploadState === 'uploaded') {
      documents = this.attachFiles(this.documentModel, this.formGroup.value[this.uploadFieldName]);
    } else {
      documents = [this.documentModel];
    }
    this.createDocuments(documents).subscribe((models: DocumentModel[]) => {
    });
  }

  private update(): void {
    const properties = this.filterPropertie(this.formGroup.value);
    this.updateDocument(this.documentModel, properties);
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
    return files.map((res: NuxeoUploadResponse) => new DocumentModel(doc).attachBatchBlob(res.batchBlob));
  }

  private performUploading(list: NuxeoUploadResponse[]): void {
    if (list.length === 0) {
      this.uploadState = null;
    } else if (list.every((res: NuxeoUploadResponse) => !res.uploaded && res.kbLoaded === 0)) {
      this.uploadState = 'preparing';
    } else if (list.some((res: NuxeoUploadResponse) => !res.uploaded && res.kbLoaded > 0)) {
      this.uploadState = 'uploading';
    } else if (list.every((res: NuxeoUploadResponse) => res.uploaded && res.kbLoaded > 0)) {
      this.uploadState = 'uploaded';
    }
  }

}
