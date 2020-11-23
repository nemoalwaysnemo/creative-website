import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ACLService } from '@core/acl';
import { DocumentModel } from '@core/api';
import { parseTabRoute } from '@core/services/helpers';
import { TAB_CONFIG } from '../disruption-tab-config';

@Component({
  selector: 'disruption-tab-info',
  templateUrl: './disruption-tab-info.component.html',
})
export class DisruptionTabInfoComponent implements OnInit, OnDestroy {

  @Input() tabStyle: any = {};

  @Input()
  set document(doc: DocumentModel) {
    this.parseTabRoute(this.tabConfig, doc);
  }

  tabs: any[] = [];

  private tabConfig: any[] = TAB_CONFIG;

  private subscription: Subscription = new Subscription();

  constructor(private aclService: ACLService) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  protected parseTabRoute(tabs: any, doc: DocumentModel): void {
    if (this.tabs.length === 0) {
      const subscription = this.aclService.filterRouterTabs(parseTabRoute(tabs), doc).subscribe((r: any[]) => {
        this.tabs = r;
      });
      this.subscription.add(subscription);
    }
  }

}
