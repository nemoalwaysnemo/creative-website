import { Component, Input, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { timer } from 'rxjs';

@Component({
  selector: 'share-document-button',
  templateUrl: './share-document-button.component.html',
  styleUrls: ['./share-document-button.component.scss'],
})
export class ShareDocumentButtonComponent implements AfterViewInit {

  btn: string = 'Copy';

  @Input() currentUrl: string = window.location.href;

  @ViewChild('inputTarget', { static: true }) inputElement: ElementRef<HTMLInputElement>;

  ngAfterViewInit() {
    this.focusInput();
  }

  focusInput() {
    if (this.inputElement) {
      this.inputElement.nativeElement.focus();
      this.inputElement.nativeElement.select();
    }
  }

  onCopy(event: any): void {
    this.btn = 'Done';
    if (event.isSuccess === true) {
      timer(2000).subscribe(() => { this.btn = 'Copy'; });
    }
  }

  onShareWorkplace(): void {
    const url = 'https://work.facebook.com/sharer.php?display=popup&u=' + this.getShareUrl();
    const options = 'toolbar=0,status=0,resizable=1,width=626,height=436';
    window.open(url, 'sharer', options);
  }

  private getShareUrl(): string {
    return encodeURIComponent(this.currentUrl);
  }

}
