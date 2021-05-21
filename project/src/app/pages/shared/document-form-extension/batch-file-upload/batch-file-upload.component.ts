import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormGroup } from '@angular/forms';
import { DynamicFormControlModel, DynamicFormService } from '@core/custom';
import { BatchUpload, NuxeoBlob, NuxeoUploadResponse } from '@core/api';
import { BatchUploadSettings, BatchUploadStatus } from './batch-file-upload.interface';
import { DragDropFileZoneSettings } from '../drag-drop-file-zone/drag-drop-file-zone.interface';
import { DragDropFileZoneService } from '../drag-drop-file-zone/drag-drop-file-zone.service';
import { DocumentPageService } from '../../services/document-page.service';
import { isValueEmpty } from '@core/services/helpers';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

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

  formModels: DynamicFormControlModel[][] = [];

  formGroups: FormGroup[] = [];

  private batchUpload: BatchUpload;

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
    // console.log(`BLUR event on ${event.model.field}: `, event);
  }

  onChange(event: any): void {
    this.updateFileTitle(event.model.field, event.model.value);
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

  onFocus(event: any): void {
    // console.log(`FOCUS event on ${event.model.field}: `, event);
  }

  onCustomEvent(event: any): void {

  }

  removeOne(index: number): void {
    const file = this.uploadItems[index];
    this.uploadItems.splice(index, 1);
    this.uploadItems.forEach((res: NuxeoUploadResponse, i: number) => { res.fileIdx = i; res.blob.fileIdx = i; this.queueFiles[file.xpath][file.fileName] = false; });
    this.emitUploadResponse('FileChanged', this.uploadItems);
  }

  removeAll(): void {
    this.uploadItems.length = 0;
    this.emitUploadResponse('FileChanged', []);
  }

  parseFileName(name: string): string {
    return name.length > 35 ? name.substr(0, 10) + '...' + name.substr(-15) : name;
  }

  getUploadFileSize(): number {
    return this.uploadItems.filter((res: NuxeoUploadResponse) => !res.original).length;
  }

  private updateFileTitle(id: string, value: any): void {
    const valid = this.formGroups.every((group: FormGroup) => group.valid);
    this.valid.emit({ type: 'valid', response: valid });
    this.uploadItems.find(res => res.fileIdx.toString() === id.split('_')[0]).title = value;
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
    const subscription = this.dragDropFileZoneService.onFilesChange().subscribe((metadata: any) => {
      this.updateQueue(metadata);
      this.onFilesChange(this.uploadItems);
    });
    this.subscription.add(subscription);
  }

  private updateQueue(m: { settings: DragDropFileZoneSettings, data: File[] }): void {
    if ((m.settings.queueLimit > 1 && !this.uploadStatus$.value.uploaded) || (m.settings.queueLimit === 1 && this.uploadItems.filter((res: NuxeoUploadResponse) => res.uploaded && res.xpath === m.settings.xpath).length === 0)) {
      this.updateQueueFiles(m);
    }
  }

  private updateQueueFiles(metadata: { settings: DragDropFileZoneSettings, data: File[] }): void {
    const xpath = metadata.settings.xpath;
    this.queueFiles[xpath] = this.queueFiles[xpath] ? this.queueFiles[xpath] : {};
    const droped = metadata.data.filter((f: File) => !this.queueFiles[xpath][f.name]);
    if (droped.length > 0) {
      this.queueFiles[xpath] = {};
      const formMode = metadata.settings.formMode;
      const label = metadata.settings.label;
      const original = metadata.settings.original;
      const isFileList = metadata.settings.queueLimit > 1;
      const target = droped.map((f: File) => new NuxeoUploadResponse({ blob: new NuxeoBlob({ content: f, xpath, label, original, isFileList, formMode }) }));
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
    }
  }

  private onFilesChange(files: NuxeoUploadResponse[]): void {
    this.emitUploadResponse('FileChanged', files);
    this.onUpload.emit({ type: 'FileSelected', response: files });
    if (this.uploadSettings.enableForm) {
      this.createSubForm(files);
      this.performSubForm(files);
    }
  }

  private updateFileResponse(res: NuxeoUploadResponse): void {
    const index = this.uploadItems.findIndex((response: NuxeoUploadResponse) => res.fileIdx.toString() === response.fileIdx.toString());
    if (this.uploadSettings.enableForm) {
      res.title = this.formGroups[index].value[`${index}_title`];
    }
    this.uploadItems[index] = res;
    const uploaded = this.uploadItems.every((response: NuxeoUploadResponse) => response.uploaded);
    this.emitUploadResponse('UploadChanged', this.uploadItems);
    this.updateUploadStatus({ uploaded, uploading: !uploaded });
    if (uploaded) {
      this.valid.emit({ type: 'valid', response: uploaded });
      this.dragDropFileZoneService.changeState(true);
    }
  }

  private upload(items: NuxeoUploadResponse[]): void {
    items.filter((res: NuxeoUploadResponse) => !res.uploaded && !res.original).forEach((res: NuxeoUploadResponse) => { this.blobs$.next(res.blob); });
  }

  private createSubForm(response: NuxeoUploadResponse[]): void {
    if (response.some((res: NuxeoUploadResponse) => res.formMode === 'create')) {
      const formModels = [];
      const formGroups = [];
      response.forEach(_ => {
        const formModel = this.formService.fromJSON([]);
        formModels.push(formModel);
        formGroups.push(this.formService.createFormGroup(formModel));
      });
      this.formModels = formModels;
      this.formGroups = formGroups;
    }
  }

  private performSubForm(response: NuxeoUploadResponse[]): void {
    for (const res of response) {
      if (res.isMainFile() && res.formMode === 'create') {
        const formModels = this.formService.fromJSON(this.getFormModel(res));
        formModels.forEach(formModel => {
          const value = {};
          const filename = this.filterFileName(res.fileName);
          const key = `${res.fileIdx}_title`;
          value[key] = filename;
          this.formService.addFormGroupControl(this.formGroups[res.fileIdx], this.formModels[res.fileIdx], formModel);
          this.formGroups[res.fileIdx].patchValue(value);
          this.updateFileTitle(key, filename);
        });
      }
    }
  }

  private filterFileName(name: string): string {
    return name.replace(/_/g, ' ').replace(/\s+/g, ' ').replace(/\.\w+$/, '');
  }

  private getFormModel(res: NuxeoUploadResponse): any[] {
    return (this.uploadSettings.formModel || []).map(m => { m.field = `${m.id}_${res.fileIdx}`; return m; });
  }
}
