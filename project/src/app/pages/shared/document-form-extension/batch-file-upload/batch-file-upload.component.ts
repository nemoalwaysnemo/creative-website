import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormGroup } from '@angular/forms';
import { BatchUpload, DocumentModel, NuxeoBlob, NuxeoUploadResponse } from '@core/api';
import { DragDropFileZoneSettings } from '../drag-drop-file-zone/drag-drop-file-zone.interface';
import { DragDropFileZoneService } from '../drag-drop-file-zone/drag-drop-file-zone.service';
import { BehaviorSubject, Observable, of as observableOf, Subject, Subscription, timer } from 'rxjs';
import { concatMap, filter, mergeMap, tap } from 'rxjs/operators';
import { BatchUploadSettings, BatchUploadStatus } from './batch-file-upload.interface';
import { DynamicFormControlModel, DynamicFormService } from '@core/custom';
import { DocumentPageService } from '../../services/document-page.service';
import { isValueEmpty } from '@core/services/helpers';

@Component({
  selector: 'batch-file-upload',
  styleUrls: ['./batch-file-upload.component.scss'],
  templateUrl: './batch-file-upload.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => BatchFileUploadComponent),
    multi: true,
  }],
})

export class BatchFileUploadComponent implements OnInit, OnDestroy, ControlValueAccessor {

  @Input()
  set settings(settings: BatchUploadSettings) {
    if (!isValueEmpty(settings)) {
      this.uploadSettings = settings;
    }
  }

  @Output() onUpload: EventEmitter<{ type: string, response: NuxeoUploadResponse[] }> = new EventEmitter<{ type: string, response: NuxeoUploadResponse[] }>();

  @Output() valid: EventEmitter<any> = new EventEmitter<any>();

  uploadStatus$: BehaviorSubject<BatchUploadStatus> = new BehaviorSubject<BatchUploadStatus>(new BatchUploadStatus());

  uploadSettings: BatchUploadSettings = new BatchUploadSettings();

  uploadItems: NuxeoUploadResponse[] = [];

  disabled: boolean = false;

  loading: boolean = false;

  formGroups: FormGroup[] = [];

  formModels: DynamicFormControlModel[] = [];

  private batchUpload: BatchUpload;

  private documents: DocumentModel[] = [];

  private subscription: Subscription = new Subscription();

  private blobs$: Subject<NuxeoBlob> = new Subject<NuxeoBlob>();

  private queueFiles: { [key: string]: { [key: string]: boolean } } = {};

  private _onChange = (_) => { };

  private _onTouched = () => { };

  constructor(private documentPageService: DocumentPageService, private formService: DynamicFormService, private dragDropFileZoneService: DragDropFileZoneService) {
    this.batchUpload = this.documentPageService.batchUpload();
    this.onUploadFiles();
    this.onFilesChanged();
    this.subscribeEvents();
  }

  ngOnInit(): void {
    timer(0).subscribe(() => { this.valid.emit({ type: 'valid', response: !this.uploadSettings.enableForm }); });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  writeValue(values: any): void {

  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onBlur(event: any): void {
    this.emitSubFormStatus();
  }

  onChange(event: any): void {
    this.emitSubFormStatus();
  }

  onFocus(event: any): void {

  }

  onCustomEvent(event: any): void {

  }

  getFieldName(item: any): string {
    if (item.xpath === 'file:content') {
      return 'Main File';
    } else if (item.xpath === 'files:files') {
      return 'Attachment';
    } else {
      return item.label;
    }
  }

  removeOne(index: number): void {
    const file = this.uploadItems[index];
    this.documents.splice(index, 1);
    this.formModels.splice(index, 1);
    this.formGroups.splice(index, 1);
    this.uploadItems.splice(index, 1);
    this.uploadItems.forEach((res: NuxeoUploadResponse, i: number) => { res.fileIdx = i; res.blob.fileIdx = i; this.queueFiles[file.xpath][file.fileName] = false; });
    this.emitUploadResponse('FileChanged', this.uploadItems);
    this.emitSubFormStatus();
  }

  removeAll(): void {
    this.documents.length = 0;
    this.formModels.length = 0;
    this.formGroups.length = 0;
    this.uploadItems.length = 0;
    this.emitUploadResponse('FileChanged', []);
  }

  parseFileName(name: string): string {
    return name.length > 35 ? name.substr(0, 10) + '...' + name.substr(-15) : name;
  }

  getUploadFileSize(): number {
    return this.uploadItems.filter((res: NuxeoUploadResponse) => !res.original).length;
  }

  private subscribeEvents(): void {
    const subscription = this.formService.onEvent().subscribe((event: any) => {
      if (event.name === 'BatchUpload') {
        this.uploadFiles(this.uploadItems);
      }
    });
    this.subscription.add(subscription);
  }

  private uploadFiles(files: NuxeoUploadResponse[]): void {
    this.updateUploadStatus({ uploaded: false, uploading: true });
    this.upload(files);
  }

  private emitUploadResponse(type: string, response: NuxeoUploadResponse[]): void {
    this._onChange(response);
    this.onUpload.emit({ type, response });
  }

  private updateUploadStatus(status: any = {}): void {
    this.uploadStatus$.next(this.uploadStatus$.value.update(status));
  }

  private onUploadFiles(): void {
    const subscription = this.blobs$.pipe(
      mergeMap((blob: NuxeoBlob) => this.batchUpload.upload(blob)),
    ).subscribe((res: NuxeoUploadResponse) => {
      this.updateFileResponse(res);
    });
    this.subscription.add(subscription);
  }

  private onFilesChanged(): void {
    const subscription = this.dragDropFileZoneService.onFilesChange().pipe(
      tap(_ => this.loading = true),
      filter((m: { settings: DragDropFileZoneSettings, data: File[] }) => this.checkDropedFiles(m)),
      concatMap((m: { settings: DragDropFileZoneSettings, data: File[] }) => this.updateQueueFiles(m)),
      concatMap((items: NuxeoUploadResponse[]) => this.uploadSettings.onFilesChangedFn(items)),
    ).subscribe((items: NuxeoUploadResponse[]) => {
      this.loading = false;
      this.onFilesChange(items);
    });
    this.subscription.add(subscription);
  }

  private checkDropedFiles(m: { settings: DragDropFileZoneSettings, data: File[] }): boolean {
    return (m.settings.queueLimit > 1 && !this.uploadStatus$.value.uploaded) || (m.settings.queueLimit === 1 && this.uploadItems.filter((res: NuxeoUploadResponse) => res.uploaded && res.xpath === m.settings.xpath).length === 0);
  }

  private updateQueueFiles(metadata: { settings: DragDropFileZoneSettings, data: File[] }): Observable<NuxeoUploadResponse[]> {
    const xpath = metadata.settings.xpath;
    this.queueFiles[xpath] = this.queueFiles[xpath] ? this.queueFiles[xpath] : {};
    const dropped = metadata.data.filter((f: File) => !this.queueFiles[xpath][f.name]);
    if (dropped.length > 0) {
      this.queueFiles[xpath] = {};
      const formMode = metadata.settings.formMode;
      const label = metadata.settings.label;
      const original = metadata.settings.original;
      const isFileList = metadata.settings.queueLimit > 1;
      const target = dropped.map((f: File) => new NuxeoUploadResponse({ blob: new NuxeoBlob({ content: f, xpath, label, original, isFileList, formMode }) }));
      const queued = this.uploadItems.filter((res: NuxeoUploadResponse) => res.xpath === xpath);
      if ((queued.length === 0) || (queued.length + target.length) <= metadata.settings.queueLimit) {
        this.uploadItems = this.uploadItems.concat(target);
      } else if (metadata.settings.queueLimit === 1) {
        this.uploadItems.splice(queued[0].fileIdx, 1, ...target.slice(0, 1));
      } else {
        const other = this.uploadItems.filter((res: NuxeoUploadResponse) => res.xpath !== xpath);
        this.uploadItems = queued.concat(target).slice(- metadata.settings.queueLimit).concat(other);
      }
      this.uploadItems.forEach((res: NuxeoUploadResponse, index: number) => { res.fileIdx = index; res.blob.fileIdx = index; this.queueFiles[res.xpath][res.fileName] = true; });
      return observableOf(this.uploadItems);
    }
  }

  private upload(items: NuxeoUploadResponse[]): void {
    items.filter((res: NuxeoUploadResponse) => !res.uploaded && !res.original).forEach((res: NuxeoUploadResponse) => { this.blobs$.next(res.blob); });
  }

  private onFilesChange(items: NuxeoUploadResponse[]): void {
    this.emitUploadResponse('FileChanged', items);
    this.onUpload.emit({ type: 'FileSelected', response: items });
    if (this.uploadSettings.enableForm) {
      this.performSubForm(items);
      this.emitSubFormStatus();
    } else {
      this.valid.emit({ type: 'valid', response: true });
    }
  }

  private updateFileResponse(item: NuxeoUploadResponse): void {
    const index = this.uploadItems.findIndex((response: NuxeoUploadResponse) => item.fileIdx.toString() === response.fileIdx.toString());
    if (this.uploadSettings.enableForm) {
      const formValue = this.formGroups[index].value;
      item.document = this.documents[item.fileIdx];
      if (item.document) {
        item.document.properties = Object.assign({}, item.document.properties, formValue);
      } else {
        item.attributes = formValue;
      }
    }
    this.uploadItems[index] = item;
    const uploaded = this.uploadItems.every((response: NuxeoUploadResponse) => response.uploaded);
    this.emitUploadResponse('UploadChanged', this.uploadItems);
    this.updateUploadStatus({ uploaded, uploading: !uploaded });
    if (uploaded) {
      this.valid.emit({ type: 'valid', response: uploaded });
      this.dragDropFileZoneService.changeState(true);
    }
  }

  private performSubForm(items: NuxeoUploadResponse[]): void {
    const formModels = [];
    const formGroups = [];
    items.forEach((item: NuxeoUploadResponse, index: number) => {
      if (item.isMainFile() && item.formMode === 'create') {
        if (item.document) {
          this.documents[item.fileIdx] = item.document;
          delete item.document;
        }
        const model = item.formModel || this.uploadSettings.formModel.map(m => Object.assign({}, m));
        const models = model.map((m: DynamicFormControlModel) => {
          m.field = m.id.split('__').shift();
          m.id = `${m.field}__${item.fileIdx}`;
          if (!m.value || m.value.length === 0) {
            if (m.field.includes('dc:title')) {
              m.value = this.performFileName(item.fileName);
            } else if (this.formGroups[index]) {
              const formValue = this.formGroups[index].value;
              m.value = formValue[m.field];
            }
          }
          if (this.uploadSettings.arrangeDirection === 'horizontal' && index > 0) {
            m['hideLabel'] = true;
          }
          return m;
        });
        delete item.formModel;
        const formModel = this.formService.fromJSON(models);
        formModels.push(formModel);
        formGroups.push(this.formService.createFormGroup(formModel));
      }
    });
    this.formModels = formModels;
    this.formGroups = formGroups;
    this.addFieldPieces();
  }

  private emitSubFormStatus(): void {
    const valid = this.formGroups.every((group: FormGroup) => group.valid);
    this.valid.emit({ type: 'valid', response: valid });
  }

  private performFileName(name: string): string {
    return name.replace(/_/g, ' ').replace(/\s+/g, ' ').replace(/\.\w+$/, '');
  }

  private addFieldPieces(): void {
    this.formGroups.forEach((value, index: number) => {
      this.uploadItems[index]['fieldPieces'] = Object.keys(value.value).length;
    });
  }
}
