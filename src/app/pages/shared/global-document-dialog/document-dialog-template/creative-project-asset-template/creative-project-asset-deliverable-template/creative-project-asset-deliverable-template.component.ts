import { Component, ViewChild, TemplateRef } from '@angular/core';
import { CreativeProjectAssetBaseTemplateComponent } from '../creative-project-asset-base-template.component';
import { NbTabComponent } from '@core/nebular/theme/components/tabset/tabset.component';
import { DocumentModel } from '@core/api';
import { Subject, timer } from 'rxjs';

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
  selector: 'creative-project-asset-deliverable-template',
  styleUrls: ['../creative-project-asset-template.scss'],
  templateUrl: './creative-project-asset-deliverable-template.component.html',
})
export class CreativeProjectAssetDeliverableTemplateComponent extends CreativeProjectAssetBaseTemplateComponent {

  listViewOptionsAsset: any = {
    deliverPackage: false,
  };

  listViewOptionsPackage: any = {
    hideHeader: false,
    selectMode: 'multi',
    deliverPackage: true,
  };

  tabItems: any = [
    {
      name: 'Assets',
      layout: 'assets',
    },
    {
      name: 'New Package',
      layout: 'packageForm',
    },
    {
      name: 'Delivery Package',
      layout: 'packageList',
    },
  ];

  tabInfo$ = new Subject<TabInfo>();

  currentTab: any = this.tabItems[0];

  templateRef: TemplateRef<any>;

  setDocument(doc: DocumentModel): void {
    if (doc) {
      this.document = doc;
      timer(0).subscribe(() => { this.tabInfo$.next(new TabInfo('docChanged', this.currentTab, doc)); });
    }
  }

  @ViewChild('assetItemView', { static: true }) private assetItemView: TemplateRef<any>;
  @ViewChild('newPackageItemView', { static: true }) private newPackageItemView: TemplateRef<any>;
  @ViewChild('packageListItemView', { static: true }) private packageListItemView: TemplateRef<any>;

  onResponse(refresh: boolean): void {
    if (refresh) {
      this.listViewOptionsPackage = {
        hideHeader: false,
        selectMode: 'multi',
        deliverPackage: true,
      };
    }
  }

<<<<<<< src/app/pages/shared/global-document-dialog/document-dialog-template/creative-project-asset-template/creative-project-asset-deliverable-template/creative-project-asset-deliverable-template.component.ts
  onChangTab(tab: NbTabComponent): void {
    const info = this.getTabItem(tab);
    if (info.name === 'Assets') {
      this.templateRef = this.assetItemView;
    } else if (info.name === 'New Package') {
      this.templateRef = this.newPackageItemView;
    } else if (info.name === 'Delivery Package') {
      this.templateRef = this.packageListItemView;
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
