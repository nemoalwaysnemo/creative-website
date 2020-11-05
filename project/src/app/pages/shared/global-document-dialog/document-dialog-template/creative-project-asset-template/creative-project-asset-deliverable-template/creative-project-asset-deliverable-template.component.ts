import { Component, ViewChild, TemplateRef } from '@angular/core';
import { CreativeProjectAssetBaseTemplateComponent } from '../creative-project-asset-base-template.component';
import { NbTabComponent } from '@core/nebular/theme/components/tabset/tabset.component';
import { DocumentFormSettings, DocumentFormStatus } from '../../../../document-form/document-form.interface';

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

  showForm: boolean = true;

  formSettings: any = {
    resetFormAfterDone: true,
    formMode: 'create',
    buttonGroup: [
      {
        label: 'Send',
        name: 'send',
        type: 'custom',
        disabled: (status: DocumentFormStatus) => status.submitted || !status.formValid,
        hasSave: true,
      },
      {
        label: 'Save draft',
        name: 'Save draft',
        type: 'save',
      },
    ],
  };

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

  currentTab: any;

  templateRef: TemplateRef<any>;

  @ViewChild('assetItemView', { static: true }) private assetItemView: TemplateRef<any>;
  @ViewChild('newPackageItemView', { static: true }) private newPackageItemView: TemplateRef<any>;
  @ViewChild('packageListItemView', { static: true }) private packageListItemView: TemplateRef<any>;

  setDocument(doc: DocumentModel): void {
    if (doc) {
      this.document = doc;
      timer(0).subscribe(() => { this.tabInfo$.next(new TabInfo('docChanged', this.currentTab, doc)); });
    }
  }

  onResponse(refresh: boolean): void {
    if (refresh) {
      this.listViewOptionsPackage = {
        hideHeader: false,
        selectMode: 'multi',
        deliverPackage: true,
      };
    }
  }

  onInit(): void {
    const selectedTitle: string = this.settings.selectedTab ? this.settings.selectedTab : 'Assets';
    this.currentTab = this.getTabItem(selectedTitle);
  }

  onChangTab(tab: NbTabComponent): void {
    const info = this.getTabItem(tab.tabTitle);
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

  private getTabItem(tabTitle: string): any {
    return this.tabItems.filter((x) => tabTitle === x.name).shift();
  }
}
