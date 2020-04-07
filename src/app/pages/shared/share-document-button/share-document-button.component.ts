import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'share-document-button',
  templateUrl: './share-document-button.component.html',
  styleUrls: ['./share-document-button.component.scss'],
})
export class ShareDocumentButtonComponent implements OnInit {

  constructor() {}

  @Input() currentUrl: string = window.location.href;

  btn: string = 'Copy';

  ngOnInit() {}

  onCopy(event: any): void {
    this.btn = 'Done';
    if (event.isSuccess === true) {
      setTimeout(() => { this.btn = 'Copy'; }, 2000);
    }
  }

  onShareGroup(): void {
    const url = 'https://work.facebook.com/sharer.php?display=popup&u=' + encodeURIComponent(this.currentUrl);
    const options = 'toolbar=0,status=0,resizable=1,width=626,height=436';
    window.open(url, 'sharer', options);
  }

}
