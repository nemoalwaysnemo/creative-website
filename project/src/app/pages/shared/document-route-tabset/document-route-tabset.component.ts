import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ACLService } from '@core/acl';
import { isValueEmpty, parseTabRoute } from '@core/services/helpers';

@Component({
  selector: 'document-route-tabset',
  templateUrl: './document-route-tabset.component.html',
})
export class DocumentRouteTabsetComponent implements OnInit, OnDestroy {

  @Input() tabStyle: any = {};

  @Input()
  set tabConfig(tabConfig: any) {
    if (!isValueEmpty(tabConfig)) {
      this.parseTabRoute(tabConfig);
    }
  }

  tabs: any[] = [];

  private subscription: Subscription = new Subscription();

  constructor(private aclService: ACLService) {

  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  protected parseTabRoute(tabConfig: any): void {
    if (this.tabs.length === 0) {
      const subscription = this.aclService.filterRouterTabs(parseTabRoute(tabConfig)).subscribe((r: any[]) => {
        this.tabs = r;
      });
      this.subscription.add(subscription);
    }
  }

}
