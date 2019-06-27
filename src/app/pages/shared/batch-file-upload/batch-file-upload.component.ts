import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, forwardRef } from '@angular/core';
import { NuxeoApiService, BatchUpload, NuxeoBlob, NuxeoUploadResponse } from '@core/api';
import { Subject, Subscription } from 'rxjs';
import { mergeMap, filter } from 'rxjs/operators';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormGroup } from '@angular/forms';
import { DynamicFormControlModel, DynamicFormLayout, DynamicFormService, DynamicInputModel } from '@core/custom';
import { DragDropFileZoneService } from './drag-drop-file-zone.service';

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

  files: NuxeoUploadResponse[] = [];

  uploaded: boolean = false;

  uploading: boolean = false;

  validComboDrag: boolean;

  disabled: boolean = false;

  private _onChange = (_) => { };

  private _onTouched = () => { };

  private batchUpload: BatchUpload;

  private subscription: Subscription = new Subscription();

  private blobs$: Subject<NuxeoBlob> = new Subject<NuxeoBlob>();

  private queueFiles: { [key: string]: { [key: string]: boolean } } = {};

  formModels: DynamicFormControlModel[][] = [];

  formLayout: DynamicFormLayout;

  formGroups: FormGroup[] = [];

  @Input() multiUpload: boolean = false;

  @Output() onUploaded: EventEmitter<NuxeoUploadResponse[]> = new EventEmitter<NuxeoUploadResponse[]>();

  @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private nuxeoApi: NuxeoApiService, private formService: DynamicFormService, private dragDropFileZoneService: DragDropFileZoneService) {
    this.batchUpload = this.nuxeoApi.batchUpload();
  }

  fileNumber: number = 0;

  ngOnInit(): void {
    console.log('%c ngOnInit!', 'background: #222; color: #bada55');
    console.log(this.files);
    this.init();
  }

  private init(): void {
    this.onUpload();
    this.onUploaded.subscribe((response: NuxeoUploadResponse[]) => {
      // this.fileNumber = files.length;
      // const formModels = [];
      // const formGroups = [];
      // files.forEach(_ => {
      //   const formModel = this.formService.fromJSON([]);
      //   formModels.push(formModel);
      //   formGroups.push(this.formService.createFormGroup(formModel));
      // });
      // this.formModels = formModels;
      // this.formGroups = formGroups;
    });
    this.dragDropFileZoneService.onFilesChange().subscribe((metadata: any) => {
      this.updateQueue(metadata);
      this.onFilesChange(this.files);
    });
  }

  ngOnDestroy() {
    console.log('%c ngOnDestroy!', 'background: #222; color: #bada55');
    this.subscription.unsubscribe();
  }

  writeValue(value: any): void {
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
    console.log(`BLUR event on ${event.model.id}: `, event);
  }

  onChange(event: any): void {
    let valid: boolean = true;
    this.formGroups.forEach((group: FormGroup) => { valid = valid && group.valid; });
    this.valid.emit(valid);
    // this.fileList.find(res => res.fileIdx.toString() === event.model.id.split('_')[0]).title = event.model.value;
  }

  onFocus(event: any): void {
    console.log(`FOCUS event on ${event.model.id}: `, event);
  }

  onCustomEvent(event: any): void {

  }

  uploadFiles(files: NuxeoUploadResponse[]): void {
    this.uploading = true;
    console.log(66666, files);
    this.upload(files.map(x => x.blob));
  }

  removeOne(index: number): void {
    const file = this.files[index];
    this.files.splice(index, 1);
    this.files.forEach((res: NuxeoUploadResponse, i: number) => { res.fileIdx = i; res.blob.fileIdx = i; this.queueFiles[file.uploadFileType][file.fileName] = false; });
    this.onUploaded.emit(this.files);
    this._onChange(this.files);
  }

  removeAll(): void {
    this.files.length = 0;
    this.onUploaded.emit([]);
    this._onChange([]);
  }

  isMultiUpload(): boolean {
    return this.multiUpload === true;
  }

  hasSubForm(): boolean {
    return false;
  }

  private onUpload(): void {
    const subscription = this.blobs$.pipe(mergeMap((blob: NuxeoBlob) => this.batchUpload.upload(blob))).subscribe((res: NuxeoUploadResponse) => {
      // this.performSubForm(res);
      this.updateFileResponse(res);
    });
    this.subscription.add(subscription);
  }

  private updateQueue(queue: { data: File[], target: string, queueLimit: number }): void {
    this.queueFiles[queue.target] = this.queueFiles[queue.target] ? this.queueFiles[queue.target] : {};
    const files = queue.data.filter((f: File) => !this.queueFiles[queue.target][f.name]);
    if (files.length > 0) {
      this.queueFiles[queue.target] = {};
      const queued = files.map((f: File) => new NuxeoUploadResponse({ blob: new NuxeoBlob({ content: f, uploadFileType: queue.target }) }));
      const target = this.files.filter((res: NuxeoUploadResponse) => res.uploadFileType === queue.target).slice(files.length, queue.queueLimit + 1).concat(queued);
      this.files = this.files.filter((res: NuxeoUploadResponse) => res.uploadFileType !== queue.target).concat(target);
      this.files.forEach((res: NuxeoUploadResponse, index: number) => { res.fileIdx = index; res.blob.fileIdx = index; this.queueFiles[res.uploadFileType][res.fileName] = true; });
    }
  }

  private onFilesChange(files: NuxeoUploadResponse[]): void {
    this.onUploaded.emit(files);
    this._onChange(files);
    if (!this.isMultiUpload()) {
      this.uploadFiles(files);
    }
  }

  private updateFileResponse(res: NuxeoUploadResponse): void {
    this.files[res.fileIdx] = res;
    this.onUploaded.emit(this.files);
    this._onChange(this.files);
    this.uploaded = this.files.every((response: NuxeoUploadResponse) => response.uploaded);
    this.uploading = !this.uploaded;
    if (this.uploaded) {
      // this.dragDropFileZoneService.changeState({ target: });
    }
  }

  private upload(blobs: NuxeoBlob[]): void {
    blobs.forEach((blob: NuxeoBlob) => { this.blobs$.next(blob); });
  }

  private performSubForm(res: NuxeoUploadResponse): void {
    if (res.uploaded) {
      const formModels = this.formService.fromJSON(this.fileInput(res));
      formModels.forEach(formModel => {
        this.formService.addFormGroupControl(this.formGroups[res.fileIdx], this.formModels[res.fileIdx], formModel);
      });
    }
  }

  private fileInput(res: NuxeoUploadResponse): Object[] {
    return [
      new DynamicInputModel({
        id: `${res.fileIdx}_title`,
        maxLength: 50,
        placeholder: `Asset title`,
        autoComplete: 'off',
        required: false,
        validators: {
          required: null,
          minLength: 4,
        },
        errorMessages: {
          required: '{{label}} is required',
          minLength: 'At least 4 characters',
        },
      }),
    ];
  }
}
