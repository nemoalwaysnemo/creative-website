import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, forwardRef } from '@angular/core';
import { NuxeoApiService, BatchUpload, NuxeoBlob, NuxeoUploadResponse } from '@core/api';
import { Subject, Subscription } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DynamicFormLayout, DynamicFormService } from '@core/custom';

@Component({
  selector: 'attachment-file-upload',
  styleUrls: ['./batch-file-upload.component.scss'],
  templateUrl: './attachment-upload.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AttachmentUploadComponent),
    multi: true,
  }],
})

export class AttachmentUploadComponent implements OnInit, OnDestroy, ControlValueAccessor {

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

  formLayout: DynamicFormLayout;

  documents: File[] = [];

  attachments: File[] = [];

  @Input() placeholder: string;

  @Input() assetPlaceholder: string;

  @Input() maxSize: number = 1048576 * 200; // 1024 == 1mb

  @Input() acceptTypes: string = '*';

  @Input() queueLimit: number = 25;

  @Output() onUploaded: EventEmitter<NuxeoUploadResponse[]> = new EventEmitter<NuxeoUploadResponse[]>();

  @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private nuxeoApi: NuxeoApiService, private formService: DynamicFormService) {
    this.batchUpload = this.nuxeoApi.batchUpload();
  }


  fileNumber: number = 0;

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

  onBlur(event: any): void {
    console.log(`BLUR event on ${event.model.id}: `, event);
  }

  onFocus(event: any): void {
    console.log(`FOCUS event on ${event.model.id}: `, event);
  }

  onCustomEvent(event: any): void {
  }

  showType(type): string {
    if (type === 'document') {
      return 'asset';
    } else {
      return type;
    }
  }

  private onUpload(): void {
    this.subscription = this.blobs$.pipe(mergeMap((blob: NuxeoBlob) => this.batchUpload.upload(blob))).subscribe((res: NuxeoUploadResponse) => {
      this.updateFileResponse(this.setUploadFileType(res));
    });
  }

  onFilesChange(files: File[], type: string): void {
    const filelist: { file: File, type: string }[] = [];
    if (this.documents.length > 0) {
      this.assetPlaceholder = 'Drop to replace';
      this.documents.splice(0, this.documents.length - 1);
      filelist.push({ file: this.documents[0], type: 'document' });
    }
    if (this.attachments.length > 0) {
      this.attachments.forEach(attachment => {
        filelist.push({ file: attachment, type: 'attachment' });
      });
    }
    this.updateFileList(filelist);
  }

  removeOne(index: number, type: string): void {
    if (type === 'document') {
      this.documents.length = 0;
      this.assetPlaceholder = 'Drop to upload asset';
    }
    if (type === 'attachment') {
      this.attachments.splice(index - this.documents.length, 1);
    }
    this.files.splice(index, 1);
    this.fileList.splice(index, 1);
    this.onUploaded.emit(this.fileList);
    this._onChange(this.fileList);
  }

  removeAll(): void {
    this.documents.length = 0;
    this.assetPlaceholder = 'Drop to upload asset';
    this.attachments.length = 0;
    this.files.length = 0;
    this.fileList.length = 0;
    this.onUploaded.emit([]);
    this._onChange([]);
  }

  private updateFileList(messages: { file: File, type: string }[]): void {
    this.fileList = messages.map((message: { file: File, type: string }, index: number) => new NuxeoUploadResponse({ fileName: message.file.name, fileSize: message.file.size, mimeType: message.file.type, fileIdx: index, uploadFileType: message.type }));
    this.files = messages.map(message => message.file);
    this.onUploaded.emit(this.fileList);
    this._onChange(this.fileList);
  }

  uploadFiles(files: File[]): void {
    this.uploading = true;
    this.upload(files);
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

  private setUploadFileType(res: NuxeoUploadResponse): NuxeoUploadResponse {
    if ((this.files.length > 1 && res.fileIdx === 0) || (this.files.length === 1 && this.documents.length > 0)) {
      res.uploadFileType = 'document';
    } else {
      res.uploadFileType = 'attachment';
    }
    return res;
  }

}
