import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, forwardRef } from '@angular/core';
import { NuxeoApiService, BatchUpload, NuxeoBlob, NuxeoUploadResponse } from '@core/api';
import { Subject, Subscription } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

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

  @Input() placeholder: string = 'Drop files here';

  @Input() maxSize: number = 1048576 * 200; // 1024 == 1mb

  @Input() acceptTypes: string = '*';

  @Input() queueLimit: number = 5;

  @Input() multiUpload: boolean = true;

  @Output() onUploaded: EventEmitter<NuxeoUploadResponse[]> = new EventEmitter<NuxeoUploadResponse[]>();

  constructor(private nuxeoApi: NuxeoApiService) {
    this.batchUpload = this.nuxeoApi.batchUpload();
  }

  ngOnInit(): void {
    this.onUpload();
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

  private onUpload(): void {
    this.subscription = this.blobs$.pipe(mergeMap((blob: NuxeoBlob) => this.batchUpload.upload(blob))).subscribe((res: NuxeoUploadResponse) => {
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
}
