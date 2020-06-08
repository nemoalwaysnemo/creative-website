import { Component, Input, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { GoogleAnalyticsService } from '@core/services';
import { DocumentModel } from '@core/api';
import { timer } from 'rxjs';

@Component({
  selector: 'share-document-button',
  templateUrl: './share-document-button.component.html',
  styleUrls: ['./share-document-button.component.scss'],
})
export class ShareDocumentButtonComponent implements AfterViewInit {

  btn: string = 'Copy';

  @Input() document: DocumentModel;

  @Input() currentUrl: string = window.location.href;

  @ViewChild('inputTarget', { static: true }) inputElement: ElementRef<HTMLInputElement>;

  constructor(private googleAnalyticsService: GoogleAnalyticsService) {
  }

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
    const url = 'https://work.facebook.com/sharer.php?display=popup&u=' + this.getShareUrl(this.currentUrl);
    const options = 'toolbar=0,status=0,resizable=1,width=626,height=436';
    window.open(url, 'sharer', options);
    this.googleAnalyticsService.trackEvent({
      'event_category': 'Share',
      'event_action': 'Share On Workplace',
      'event_label': `Share On Workplace - ${this.document.title}`,
      'event_value': this.document.uid,
      'dimensions.docId': this.document.uid,
      'dimensions.docTitle': this.document.title,
    });
  }

  private getShareUrl(url: string): string {
    return encodeURIComponent(url);
  }

}
