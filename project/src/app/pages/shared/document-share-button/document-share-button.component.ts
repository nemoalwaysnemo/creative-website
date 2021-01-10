import { Component, Input, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { DocumentPageService } from '../services/document-page.service';
import { DocumentModel } from '@core/api';
import { timer } from 'rxjs';

@Component({
  selector: 'document-share-button',
  templateUrl: './document-share-button.component.html',
  styleUrls: ['./document-share-button.component.scss'],
})
export class DocumentShareButtonComponent implements AfterViewInit {

  btn: string = 'Copy';

  @Input() document: DocumentModel;

  @Input() shareUrl: string = this.documentPageService.getCurrentFullUrl();

  @ViewChild('inputTarget', { static: true }) inputElement: ElementRef<HTMLInputElement>;

  constructor(private documentPageService: DocumentPageService) {
  }

  ngAfterViewInit(): void {
    this.focusInput();
  }

  focusInput(): void {
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
    const url = 'https://work.facebook.com/sharer.php?display=popup&u=' + this.getShareUrl(this.shareUrl);
    const options = 'toolbar=0,status=0,resizable=1,width=626,height=436';
    window.open(url, 'sharer', options);
    this.documentPageService.googleAnalyticsTrackEvent({
      event_category: 'Share',
      event_action: 'Share On Workplace',
      event_label: `Share On Workplace - ${this.document.title}`,
      'dimensions.docId': this.document.uid,
      'dimensions.docTitle': this.document.title,
      'dimensions.docType': this.document.type,
      'dimensions.userEvent': `Share On Workplace`,
    });
  }

  private getShareUrl(url: string): string {
    return encodeURIComponent(url);
  }

}
