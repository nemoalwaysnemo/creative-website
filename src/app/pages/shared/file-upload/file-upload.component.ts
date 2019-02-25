import { Component } from '@angular/core';
import { BatchUploadService } from '@core/api/api.batch-upload.service';
import { BatchUploadQueueEvent } from '@core/api/nuxeo/lib/nuxeo.batch-upload-queue';

@Component({
  selector: 'tbwa-file-upload',
  styleUrls: ['./file-upload.component.scss'],
  templateUrl: './file-upload.component.html',
})

export class FileUploadComponent {

  private files: FileList;

  constructor(private batchUploadService: BatchUploadService) { }

  onChange(event): any {
    this.files = event.target.files;
  }

  upload(): void {
    this.batchUploadService.upload(Array.from(this.files)).subscribe((batchUploadQueueEvent: BatchUploadQueueEvent) => {
      console.log('upload!!!', batchUploadQueueEvent);
    });
  }

  cancel(): void {
    this.batchUploadService.cancel().subscribe(res => {
      console.log('cancel!!!', res);
    });
  }
}
