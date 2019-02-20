import { Component } from '@angular/core';
import { BatchUploadService } from '@core/api/api.batch-upload.service';

@Component({
  selector: 'tbwa-file-upload',
  styleUrls: ['./file-upload.component.scss'],
  templateUrl: './file-upload.component.html',
})

export class FileUploadComponent {

  private files: File[];

  constructor(private batchUploadService: BatchUploadService) { }

  onChange(event): any {
    this.files = event.target.files;
    console.log(11111, this.files);
  }

  upload(): void {
    this.batchUploadService.upload(this.files).subscribe(res => {
      console.log('upload!!!', res);
    });
  }

  cancel(): void {
    this.batchUploadService.cancel().subscribe(res => {
      console.log('cancel!!!', res);
    });
  }
}
