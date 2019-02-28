import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NuxeoApiService, BatchUpload, NuxeoBlob, NuxeoUploadResponse } from '@core/api';
import { Subject, Subscription } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { HttpEvent, HttpRequest, HttpClient, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'tbwa-file-upload',
  styleUrls: ['./file-upload.component.scss'],
  templateUrl: './file-upload.component.html',
})

export class FileUploadComponent implements OnInit {

  files: File[] = [];

  progress: number = 0;

  private _progress: number[] = [];

  private batchUpload: BatchUpload;

  private blobs$: Subject<NuxeoBlob> = new Subject<NuxeoBlob>();

  @Input() placeholder: string = 'Drop files here';

  @Input() maxSize: number = 1048576 * 10; // 1024 == 1mb

  @Input() acceptTypes: string = '*';

  @Output() onUploaded: EventEmitter<NuxeoUploadResponse> = new EventEmitter<NuxeoUploadResponse>();

  constructor(private nuxeoApi: NuxeoApiService, public httpClient: HttpClient) {
    this.batchUpload = this.nuxeoApi.batchUpload();
  }

  ngOnInit(): void {
    this.onUpload();
  }

  private onUpload(): void {
    this.blobs$.pipe(mergeMap((blob: NuxeoBlob) => this.batchUpload.upload(blob))).subscribe((res: NuxeoUploadResponse) => {
      this.onUploaded.emit(res);
      this.progress = this.calculatePercentage(res);
    });
  }

  cancel() {
    this.progress = 0;
    this._progress = [];
  }

  onFilesChange(files: File[]): void {
  }

  uploadFiles(files: File[]): void {
    files.filter((value, index, self) => {
      console.log(self[index].name, value.name);
      return self[index].name === value.name;
    });
    console.log(files);
    // this.upload(this.files);
  }

  private calculatePercentage(res: NuxeoUploadResponse): number {
    const size = this.files.length;
    this._progress[res.fileName] = res.percentLoaded;
    return size > 0 ? (this._progress.reduce((a, v) => a + v) / size) : 0;
  }

  private upload(files: File[]): void {
    for (const droppedFile of files) {
      this.blobs$.next(new NuxeoBlob({ content: droppedFile }));
    }
  }
}
