import { Component, ViewChild, TemplateRef, OnInit, OnDestroy, Input } from '@angular/core';
import { NbTabComponent } from '@core/nebular/theme/components/tabset/tabset.component';
import { DocumentModel } from '@core/api';
import { Subject, timer, Subscription } from 'rxjs';

export class TabInfo {
  readonly type: string;
  readonly tabItem: any;
  readonly document: DocumentModel;
  constructor(type: string, item: any, doc: DocumentModel) {
    this.type = type;
    this.tabItem = item;
    this.document = doc;
  }
}

@Component({
  selector: 'creative-asset-template-tabs',
  styleUrls: ['./creative-asset-template-tabs.scss'],
  templateUrl: './creative-asset-template-tabs.component.html',
})
export class CreativeAssetTemplateTabsComponent implements OnInit, OnDestroy {

  document: DocumentModel;

  @Input()
  set documentModel(doc: DocumentModel) {
    if (doc) {
      this.document = doc;
      timer(0).subscribe(() => { this.tabInfo$.next(new TabInfo('docChanged', this.currentTab, doc)); });
    }
  }

  settings: any = {};

  tabItems: any = [
    {
      name: 'Info',
    },
    {
      name: 'Usage Rights',
    },
    {
      name: 'Asset Requests',
    },
  ];

  tabInfo$ = new Subject<TabInfo>();

  protected subscription: Subscription = new Subscription();

  currentTab: any;

  templateRef: TemplateRef<any>;


  @ViewChild('infoView', { static: true }) private infoView: TemplateRef<any>;
  @ViewChild('usageRightsView', { static: true }) private usageRightsView: TemplateRef<any>;
  @ViewChild('assetRequestsView', { static: true }) private assetRequestsView: TemplateRef<any>;

  ngOnInit(): void {
    this.currentTab = 'Assets';
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onChangTab(tab: NbTabComponent): void {
    const info = this.getTabItem(tab.tabTitle);
    if (info.name === 'Info') {
      this.templateRef = this.infoView;
    } else if (info.name === 'Usage Rights') {
      this.templateRef = this.usageRightsView;
    } else if (info.name === 'Asset Requests') {
      this.templateRef = this.assetRequestsView;
    }
    if (tab.tabTitle !== this.currentTab.name) {
      this.tabInfo$.next(new TabInfo('tabChanged', info, this.document));
    }
    this.currentTab = info;
  }

  private getTabItem(tabTitle: string): any {
    return this.tabItems.filter((x) => tabTitle === x.name).shift();
  }
}
