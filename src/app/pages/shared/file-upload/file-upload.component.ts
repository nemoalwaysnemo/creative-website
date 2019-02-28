import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NuxeoApiService, BatchUpload, NuxeoBlob, NuxeoUploadResponse } from '@core/api';
import { Subject, Subscription, BehaviorSubject } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { HttpEvent, HttpRequest, HttpClient, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'tbwa-file-upload',
  styleUrls: ['./file-upload.component.scss'],
  templateUrl: './file-upload.component.html',
})

export class FileUploadComponent implements OnInit {

  files: File[] = [];

  uploaded: boolean = false;

  uploading: boolean = false;

  private batchUpload: BatchUpload;

  private fileList: NuxeoUploadResponse[] = [];

  private blobs$: Subject<NuxeoBlob> = new Subject<NuxeoBlob>();

  @Input() placeholder: string = 'Drop files here';

  @Input() maxSize: number = 1048576 * 10; // 1024 == 1mb

  @Input() acceptTypes: string = '*';

  @Output() onUploaded: EventEmitter<NuxeoUploadResponse[]> = new EventEmitter<NuxeoUploadResponse[]>();

  constructor(private nuxeoApi: NuxeoApiService, public httpClient: HttpClient) {
    this.batchUpload = this.nuxeoApi.batchUpload();
  }

  ngOnInit(): void {
    this.onUpload();
  }

  private onUpload(): void {
    this.blobs$.pipe(mergeMap((blob: NuxeoBlob) => this.batchUpload.upload(blob))).subscribe((res: NuxeoUploadResponse) => {
      this.updateFileResponse(res);
    });
  }

  onFilesChange(files: File[]): void {
    this.updateFileList(files);
  }

  uploadFiles(files: File[]): void {
    this.uploading = true;
    this.upload(files);
  }

  removeOne(index: number): void {
    this.files.splice(index, 1);
    this.fileList.splice(index, 1);
    this.onUploaded.emit(this.fileList);
  }

  removeAll(): void {
    this.files.length = 0;
    this.fileList.length = 0;
    this.onUploaded.emit([]);
  }

  private updateFileList(files: File[]): void {
    this.fileList = files.map((file: File, index: number) => new NuxeoUploadResponse({ fileName: file.name, fileSize: file.size, mimeType: file.type, fileIdx: index }));
    this.onUploaded.emit(this.fileList);
  }

  private updateFileResponse(res: NuxeoUploadResponse): void {
    this.fileList[res.fileIdx] = res;
    this.onUploaded.emit(this.fileList);
    this.uploaded = this.fileList.every((response: NuxeoUploadResponse) => response.uploaded);
    this.uploading = !this.uploaded;
  }

  private upload(files: File[]): void {
    files.forEach((file: File) => { this.blobs$.next(new NuxeoBlob({ content: file })); });
  }
}
