import { OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

export class BaseDocumentViewComponent implements OnInit, OnDestroy {

  protected subscription: Subscription = new Subscription();

  onInit() {
  }

  onDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.onInit();
  }

  ngOnDestroy(): void {
    this.onDestroy();
  }

}
