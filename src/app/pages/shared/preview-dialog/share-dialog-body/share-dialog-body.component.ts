import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'share-dialog-body',
  templateUrl: './share-dialog-body.component.html',
  styleUrls: ['./share-dialog-body.component.scss'],
})
export class ShareDialogBodyComponent implements OnInit {

  constructor() {}

  currentUrl: string;

  btn: string = 'Copy';

  ngOnInit() {
    this.currentUrl = window.location.href;
  }

  onCopy(event: any): void {
    this.btn = 'Done';
    if (event.isSuccess === true) {
      setTimeout(() => { this.btn = 'Copy'; }, 2000);
    }
  }

}
