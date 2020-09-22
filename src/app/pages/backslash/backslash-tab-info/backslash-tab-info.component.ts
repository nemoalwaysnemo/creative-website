import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ACLService } from '@core/acl';
import { parseTabRoute } from '@core/services/helpers';
import { TAB_CONFIG } from '../backslash-tab-config';

@Component({
  selector: 'backslash-tab-info',
  templateUrl: './backslash-tab-info.component.html',
})
export class BackslashTabInfoComponent implements OnInit, OnDestroy {

  @Input() tabStyle: any = {};

  tabs: any[] = [];

  private tabConfig: any[] = TAB_CONFIG;

  private subscription: Subscription = new Subscription();

  constructor(private aclService: ACLService) {
  }

  ngOnInit(): void {
    this.parseTabRoute();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  protected parseTabRoute(): void {
    if (this.tabs.length === 0) {
      const subscription = this.aclService.filterRouterTabs(parseTabRoute(this.tabConfig)).subscribe((r: any[]) => {
        this.tabs = r;
      });
      this.subscription.add(subscription);
    }
  }

}
