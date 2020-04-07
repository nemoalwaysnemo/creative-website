import { Component, Input } from '@angular/core';
import { timer } from 'rxjs';

@Component({
  selector: 'share-document-button',
  templateUrl: './share-document-button.component.html',
  styleUrls: ['./share-document-button.component.scss'],
})
export class ShareDocumentButtonComponent {

  @Input() currentUrl: string = window.location.href;

  btn: string = 'Copy';

  onCopy(event: any): void {
    this.btn = 'Done';
    if (event.isSuccess === true) {
      timer(2000).subscribe(() => { this.btn = 'Copy'; });
    }
  }

  onShareGroup(): void {
    const url = 'https://work.facebook.com/sharer.php?display=popup&u=' + this.getShareUrl();
    const options = 'toolbar=0,status=0,resizable=1,width=626,height=436';
    window.open(url, 'sharer', options);
  }

  private getShareUrl(): string {
    return encodeURIComponent(this.currentUrl);
  }

}
