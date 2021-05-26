import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Subject, timer } from 'rxjs';
import { DocumentModel } from '@core/api';
import { NbTabComponent } from '@core/nebular/theme/components/tabset/tabset.component';

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
  selector: 'document-creative-project-asset-detail-info',
  styleUrls: ['../../document-creative-project-mgt.component.scss', '../document-creative-project-asset-page.component.scss'],
  templateUrl: './document-creative-project-asset-detail-info.component.html',
})
export class DocumentCreativeProjectAssetDetailInfoComponent implements OnInit {

  document: DocumentModel;

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

  currentTab: any;

  templateRef: TemplateRef<any>;

  @ViewChild('assetInfoItemView', { static: true }) private assetInfoItemView: TemplateRef<any>;
  @ViewChild('usageRightsItemView', { static: true }) private usageRightsItemView: TemplateRef<any>;
  @ViewChild('assetRequestsItemView', { static: true }) private assetRequestsItemView: TemplateRef<any>;

  @Input()
  set documentModel(doc: DocumentModel) {
    if (doc) {
      this.document = doc;
      timer(0).subscribe(() => { this.tabInfo$.next(new TabInfo('docChanged', this.currentTab, doc)); });
    }
  }

  ngOnInit(): void {
    this.currentTab = 'Info';
  }

  onChangTab(tab: NbTabComponent): void {
    const info = this.getTabItem(tab);
    this.templateRef = null;
    if (info.name === 'Info') {
      this.templateRef = this.assetInfoItemView;
    } else if (info.name === 'Usage Rights') {
      this.templateRef = this.usageRightsItemView;
    } else if (info.name === 'Asset Requests') {
      this.templateRef = this.assetRequestsItemView;
    }
    if (tab.tabTitle !== this.currentTab.name) {
      this.tabInfo$.next(new TabInfo('tabChanged', info, this.document));
    }
    this.currentTab = info;
  }

  private getTabItem(tab: NbTabComponent): any {
    return this.tabItems.filter((x) => tab.tabTitle === x.name).shift();
  }
}
