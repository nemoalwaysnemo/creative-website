import { Component } from '@angular/core';
import { FileUploadService } from '@core/api/api.file-upload.service';

@Component({
  selector: 'tbwa-file-upload',
  styleUrls: ['./file-upload.component.scss'],
  templateUrl: './file-upload.component.html',
})

export class FileUploadComponent {
  private file: File;

  constructor(private fileUploadService: FileUploadService) {}

  onChange(event): any {
    const fileList: FileList = event.target.files;
    this.file = fileList[0];
  }

  click(): void {
    this.fileUploadService.upload(this.file);
  }
}
