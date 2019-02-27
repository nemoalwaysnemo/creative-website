import { Component, OnInit } from '@angular/core';
import { UploadEvent, UploadFile, FileSystemFileEntry } from 'ngx-file-drop';
import { NuxeoApiService, BatchUpload, NuxeoBlob, NuxeoUploadResponse } from '@core/api';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'tbwa-file-upload',
  styleUrls: ['./file-upload.component.scss'],
  templateUrl: './file-upload.component.html',
})

export class FileUploadComponent implements OnInit {

  files: UploadFile[] = [];

  private batchUpload: BatchUpload;

  private blobs$: Subject<NuxeoBlob> = new Subject<NuxeoBlob>();

  constructor(private nuxeoApi: NuxeoApiService) {
    this.batchUpload = this.nuxeoApi.batchUpload();
  }

  ngOnInit(): void {
    this.onUpload();
  }

  private onUpload() {
    this.blobs$.pipe(
      map((blob: NuxeoBlob) => this.batchUpload.upload(blob)),
    ).subscribe((batchUploadBlob: Observable<NuxeoUploadResponse>) => {
      batchUploadBlob.subscribe((uploadResponse: NuxeoUploadResponse) => {
        console.log(uploadResponse);
      });
    });
  }

  dropped(event: UploadEvent) {
    this.files = event.files;
    for (const droppedFile of event.files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => { this.blobs$.next(new NuxeoBlob({ content: file })); });
      }
    }
  }

  fileOver(event: DragEvent): void {
  }

  fileLeave(event: DragEvent): void {
  }
}
