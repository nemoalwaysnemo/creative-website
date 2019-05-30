import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, forwardRef } from '@angular/core';
import { NuxeoApiService, BatchUpload, NuxeoBlob, NuxeoUploadResponse } from '@core/api';
import { Subject, Subscription } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormGroup } from '@angular/forms';
import { DynamicFormControlModel, DynamicFormLayout, DynamicFormService, DynamicInputModel, DynamicSuggestionModel } from '@core/custom';

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

  files: File[] = [];

  uploaded: boolean = false;

  uploading: boolean = false;

  validComboDrag: boolean;

  private disabled: boolean = false;

  private _onChange = (_) => { };

  private _onTouched = () => { };

  private batchUpload: BatchUpload;

  private fileList: NuxeoUploadResponse[] = [];

  private subscription: Subscription = new Subscription();

  private blobs$: Subject<NuxeoBlob> = new Subject<NuxeoBlob>();

  formModel: DynamicFormControlModel[] = [];

  formLayout: DynamicFormLayout;

  formGroup: FormGroup;

  @Input() placeholder: string = 'Drop files here';

  @Input() maxSize: number = 1048576 * 200; // 1024 == 1mb

  @Input() acceptTypes: string = '*';

  @Input() queueLimit: number = 5;

  @Input() multiUpload: boolean = true;

  @Output() onUploaded: EventEmitter<NuxeoUploadResponse[]> = new EventEmitter<NuxeoUploadResponse[]>();

  constructor(private nuxeoApi: NuxeoApiService, private formService: DynamicFormService) {
    this.batchUpload = this.nuxeoApi.batchUpload();
  }

  ngOnInit(): void {
    this.onUpload();
    this.formModel = this.formService.fromJSON([]);
    this.formGroup = this.formService.createFormGroup(this.formModel);
  }

  ngOnDestroy() {
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
    this.fileList.find(res => res.fileIdx.toString() === event.model.id.split('_')[0]).title = event.model.value;
  }

  onFocus(event: any): void {
    console.log(`FOCUS event on ${event.model.id}: `, event);
  }

  onCustomEvent(event: any): void {
  }

  private onUpload(): void {
    this.subscription = this.blobs$.pipe(mergeMap((blob: NuxeoBlob) => this.batchUpload.upload(blob))).subscribe((res: NuxeoUploadResponse) => {
      if (res.uploaded) {
        const formModels = this.formService.fromJSON(this.fileInput(res));
        formModels.forEach(formModel => {
          this.formService.addFormGroupControl(this.formGroup, this.formModel, formModel);
        });
      }

      this.updateFileResponse(res);
    });
  }

  onFilesChange(files: File[]): void {
    if (!this.uploaded) {
      this.updateFileList(files);
      if (!this.isMultiUpload()) {
        this.uploadFiles(files);
      }
    }
  }

  uploadFiles(files: File[]): void {
    this.uploading = true;
    this.upload(files);
  }

  removeOne(index: number): void {
    this.files.splice(index, 1);
    this.fileList.splice(index, 1);
    this.onUploaded.emit(this.fileList);
    this._onChange(this.fileList);
  }

  removeAll(): void {
    this.files.length = 0;
    this.fileList.length = 0;
    this.onUploaded.emit([]);
    this._onChange([]);
  }

  isMultiUpload(): boolean {
    return this.multiUpload === true;
  }

  private updateFileList(files: File[]): void {
    this.fileList = files.map((file: File, index: number) => new NuxeoUploadResponse({ fileName: file.name, fileSize: file.size, mimeType: file.type, fileIdx: index }));
    this.onUploaded.emit(this.fileList);
    this._onChange(this.fileList);
  }

  private updateFileResponse(res: NuxeoUploadResponse): void {
    this.fileList[res.fileIdx] = res;
    this.onUploaded.emit(this.fileList);
    this._onChange(this.fileList);
    this.uploaded = this.fileList.every((response: NuxeoUploadResponse) => response.uploaded);
    this.uploading = !this.uploaded;
  }

  private upload(files: File[]): void {
    files.forEach((file: File) => { this.blobs$.next(new NuxeoBlob({ content: file })); });
  }

  private fileInput(res: NuxeoUploadResponse): Object[] {
    return [
      new DynamicInputModel({
        id: `${res.fileIdx}_title`,
        label: 'Asset Title',
        maxLength: 50,
        placeholder: 'Title',
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
