import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormGroup } from '@angular/forms';
import { DynamicFormControlModel, DynamicFormLayout, DynamicFormService, DynamicInputModel } from '@core/custom';
import { NuxeoApiService, BatchUpload, NuxeoBlob, NuxeoUploadResponse } from '@core/api';
import { BatchUploadSettings, BatchUploadStatus } from './batch-file-upload.interface';
import { DragDropFileZoneSettings } from '../drag-drop-file-zone/drag-drop-file-zone.interface';
import { DragDropFileZoneService } from '../drag-drop-file-zone/drag-drop-file-zone.service';
import { isValueEmpty } from '@core/services/helpers';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { mergeMap, filter } from 'rxjs/operators';

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

  @Output() onUpload: EventEmitter<NuxeoUploadResponse[]> = new EventEmitter<NuxeoUploadResponse[]>();

  @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();

  uploadStatus$: BehaviorSubject<BatchUploadStatus> = new BehaviorSubject<BatchUploadStatus>(new BatchUploadStatus());

  uploadSettings: BatchUploadSettings = new BatchUploadSettings();

  uploadItems: NuxeoUploadResponse[] = [];

  disabled: boolean = false;

  formModels: DynamicFormControlModel[][] = [];

  formLayout: DynamicFormLayout;

  formGroups: FormGroup[] = [];

  attachments: NuxeoUploadResponse[] = [];

  fileNumber: number = 0;

  private batchUpload: BatchUpload;

  private subscription: Subscription = new Subscription();

  private blobs$: Subject<NuxeoBlob> = new Subject<NuxeoBlob>();

  private queueFiles: { [key: string]: { [key: string]: boolean } } = {};

  private _onChange = (_) => { };

  private _onTouched = () => { };

  constructor(private nuxeoApi: NuxeoApiService, private formService: DynamicFormService, private dragDropFileZoneService: DragDropFileZoneService) {
    this.batchUpload = this.nuxeoApi.batchUpload();
    this.onUploadFiles();
    this.onFilesUploaded();
    this.onFilesChanged();
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  writeValue(values: any): void {
    if (!isValueEmpty(values)) {
      values.forEach((v: any) => {
        v.file['size'] = parseInt(v.file.length, 10);
      });
      this.attachments = values;
    }
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
    this.setFileTitle(event.model.field, event.model.value);
  }

  setFileTitle(id: string, value: any): void {
    let valid: boolean = true;
    this.formGroups.forEach((group: FormGroup) => { valid = valid && group.valid; });
    this.valid.emit(valid);
    this.uploadItems.find(res => res.fileIdx.toString() === id.split('_')[0]).title = value;
  }

  onFocus(event: any): void {
    // console.log(`FOCUS event on ${event.model.field}: `, event);
  }

  onCustomEvent(event: any): void {

  }

  uploadFiles(files: NuxeoUploadResponse[]): void {
    this.updateUploadStatus({ uploaded: false, uploading: true });
    this.upload(files);
  }

  buildFileList(files: NuxeoUploadResponse[]): void {
    const attachmentList = [];
    this.attachments.forEach(attachment => {
      attachmentList.push({ batchBlob: attachment.file, kbLoaded: 1, uploaded: true, xpath: 'files:files' });
    });
    this.onUpload.emit([...attachmentList, ...files]);
    this._onChange([...attachmentList, ...files]);
  }

  removeOneAttachmen(index: number): void {
    this.attachments.splice(index, 1);
  }

  removeOne(index: number): void {
    const file = this.uploadItems[index];
    this.uploadItems.splice(index, 1);
    this.uploadItems.forEach((res: NuxeoUploadResponse, i: number) => { res.fileIdx = i; res.blob.fileIdx = i; this.queueFiles[file.xpath][file.fileName] = false; });
    this.buildFileList(this.uploadItems);
  }

  removeAll(): void {
    this.uploadItems.length = 0;
    this.buildFileList([]);
  }

  parseFileName(name: string): string {
    return name.length > 35 ? name.substr(0, 10) + '...' + name.substr(-15) : name;
  }

  private updateUploadStatus(status: any = {}): void {
    this.uploadStatus$.next(this.uploadStatus$.value.update(status));
  }

  private onUploadFiles(): void {
    const subscription = this.blobs$.pipe(
      mergeMap((blob: NuxeoBlob) => this.batchUpload.upload(blob)),
    ).subscribe((res: NuxeoUploadResponse) => {
      this.updateFileResponse(res);
      if (this.uploadSettings.multiUpload) {
        this.performSubForm(res);
      }
    });
    this.subscription.add(subscription);
  }

  private onFilesUploaded(): void {
    const subscription = this.onUpload.pipe(
      filter((res: NuxeoUploadResponse[]) => {
        let uploaded = false;
        res.forEach(i => { uploaded = uploaded || i.uploaded; });
        return !uploaded;
      },
      ),
    ).subscribe((response: NuxeoUploadResponse[]) => {
      if (response.some((res: NuxeoUploadResponse) => res.formMode === 'create')) {
        this.fileNumber = response.length;
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
    this.queueFiles[metadata.settings.xpath] = this.queueFiles[metadata.settings.xpath] ? this.queueFiles[metadata.settings.xpath] : {};
    const droped = metadata.data.filter((f: File) => !this.queueFiles[metadata.settings.xpath][f.name]);
    if (droped.length > 0) {
      this.queueFiles[metadata.settings.xpath] = {};
      const target = droped.map((f: File) => new NuxeoUploadResponse({ blob: new NuxeoBlob({ content: f, xpath: metadata.settings.xpath, formMode: metadata.settings.formMode }) }));
      const queued = this.uploadItems.filter((res: NuxeoUploadResponse) => res.xpath === metadata.settings.xpath);
      if ((queued.length === 0) || (queued.length + target.length) <= metadata.settings.queueLimit) {
        this.uploadItems = this.uploadItems.concat(target);
      } else if (metadata.settings.queueLimit === 1) {
        this.uploadItems.splice(queued[0].fileIdx, 1, ...target.slice(0, 1));
      } else {
        const other = this.uploadItems.filter((res: NuxeoUploadResponse) => res.xpath !== metadata.settings.xpath);
        this.uploadItems = queued.concat(target).slice(- metadata.settings.queueLimit).concat(other);
      }
      this.uploadItems.forEach((res: NuxeoUploadResponse, index: number) => { res.fileIdx = index; res.blob.fileIdx = index; this.queueFiles[res.xpath][res.fileName] = true; });
    }
  }

  private onFilesChange(files: NuxeoUploadResponse[]): void {
    this.buildFileList(files);
    if (!this.uploadSettings.multiUpload) {
      this.uploadFiles(files);
    }
  }

  private updateFileResponse(res: NuxeoUploadResponse): void {
    const index = this.uploadItems.findIndex((response: NuxeoUploadResponse) => res.fileIdx.toString() === response.fileIdx.toString());
    this.uploadItems[index] = res;
    this.buildFileList(this.uploadItems);
    const uploaded = this.uploadItems.every((response: NuxeoUploadResponse) => response.uploaded);
    this.updateUploadStatus({ uploaded, uploading: !uploaded });
    if (uploaded) {
      this.dragDropFileZoneService.changeState(true);
    }
  }

  private upload(items: NuxeoUploadResponse[]): void {
    items.filter((res: NuxeoUploadResponse) => !res.uploaded).forEach((res: NuxeoUploadResponse) => { this.blobs$.next(res.blob); });
  }

  private performSubForm(res: NuxeoUploadResponse): void {
    if (res.uploaded && res.formMode === 'create') {
      const formModels = this.formService.fromJSON(this.fileInput(res));
      formModels.forEach(formModel => {
        this.formService.addFormGroupControl(this.formGroups[res.fileIdx], this.formModels[res.fileIdx], formModel);
        const value = {};
        const filename = this.filterFileName(res.fileName);
        value[`${res.fileIdx}_title`] = filename;
        this.formGroups[res.fileIdx].patchValue(value);
        this.setFileTitle(`${res.fileIdx}_title`, filename);
      });
    }
  }

  private filterFileName(name: string): string {
    return name.replace(/_/g, ' ').replace(/\s+/g, ' ').replace(/\.\w+$/, '');
  }

  private fileInput(res: NuxeoUploadResponse): any[] {
    return [
      new DynamicInputModel({
        id: `${res.fileIdx}_title`,
        maxLength: 150,
        placeholder: `Asset title`,
        autoComplete: 'off',
        required: false,
        validators: {
          required: null,
          minLength: 4,
        },
        errorMessages: {
          required: '{{placeholder}} is required',
          minLength: 'At least 4 characters',
        },
      }),
    ];
  }
}
