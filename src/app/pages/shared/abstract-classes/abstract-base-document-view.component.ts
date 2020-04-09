import { OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Environment } from '@environment/environment';

export abstract class AbstractBaseDocumentViewComponent implements OnInit, OnDestroy {

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
