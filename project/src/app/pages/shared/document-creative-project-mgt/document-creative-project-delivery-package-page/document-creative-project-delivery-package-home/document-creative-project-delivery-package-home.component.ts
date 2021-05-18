import { Component, ComponentFactoryResolver } from '@angular/core';
import { DocumentModel, GlobalSearchParams, UserModel } from '@core/api';
import { Observable, of as observableOf } from 'rxjs';
import { ListSearchRowCustomViewComponent } from '../../../list-search-form-in-dialog';
import { ListSearchRowCustomViewSettings } from '../../../list-search-form/list-search-form.interface';
import { DocumentListViewItem } from '../../../document-list-view/document-list-view.interface';
import { GlobalSearchFormSettings } from '../../../global-search-form/global-search-form.interface';
import { NUXEO_DOC_TYPE } from '@environment/environment';
import { DocumentCreativeProjectMgtBaseComponent } from '../../document-creative-project-mgt-base.component';
import { ProjectMgtNavigationSettings } from '../../shared/document-creative-project-navigation/document-creative-project-navigation.interface';
import { CreativeProjectMgtSettings } from '../../document-creative-project-mgt.interface';
import { NbMenuItem } from '@core/nebular/theme';
import { DocumentPageService } from '../../../../shared/services/document-page.service';
import { DatePipe } from '@angular/common';
import { DocumentFormStatus } from '@pages/shared/document-form/document-form.interface';

export class PackageHistoryListViewItem {
  [key: string]: any;
  readonly uid: string;
  readonly history: any;

  constructor(data: any = {}) {
    Object.assign(this, data);
  }
}

@Component({
  selector: 'document-creative-project-delivery-package-home',
  styleUrls: ['../../document-creative-project-mgt.component.scss', './document-creative-project-delivery-package-home.component.scss'],
  templateUrl: './document-creative-project-delivery-package-home.component.html',
})
export class DocumentCreativeProjectDeliveryPackageHomeComponent extends DocumentCreativeProjectMgtBaseComponent {

  loading: boolean = true;

  actions: NbMenuItem[] = [
    {
      id: 'delivery',
      title: 'Create New Package',
      type: 'page',
    },
  ];

  doc: DocumentModel;

  packageDocument: DocumentModel;

  defaultParams: any = {
    ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_DELIVERY_PACKAGE_TYPE,
    currentPageIndex: 0,
    ecm_fulltext: '',
  };

  navSettings: ProjectMgtNavigationSettings;

  historyList: any = [];

  historyItemList: any = [];

  assetList: any = [];

  searchFormSettingsPackageHome: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    schemas: ['dublincore', 'The_Loupe_Main', 'The_Loupe_Delivery', 'collection'],
    source: 'document-creative-project-delivery-package',
    enableSearchForm: false,
    autoSearch: false,
  });

  listViewSettingsPackage: any = {
    hideHeader: false,
    hideSubHeader: true,
    columns: {
      icon: {
        sort: false,
        type: 'custom',
        renderComponentData: new ListSearchRowCustomViewSettings({
          viewType: 'icon',
        }),
        renderComponent: ListSearchRowCustomViewComponent,
      },
      receipient: {
        title: 'Recipient',
        sort: false,
      },
      date: {
        title: 'Date sent',
        sort: false,
        valuePrepareFunction: (value: any) => {
          return value ? new DatePipe('en-US').transform(value, 'yyyy-MM-dd') : null;
        },
      },
      sender: {
        title: 'Sent by',
        sort: false,
      },
    },
  };

  listViewSettingsHistory: any = {
    hideHeader: false,
    hideSubHeader: true,
    columns: {
      date: {
        title: 'Date',
        sort: false,
        valuePrepareFunction: (value: any) => {
          return value ? new DatePipe('en-US').transform(value, 'yyyy-MM-dd') : null;
        },
      },
      recipient: {
        title: 'Recipient',
        sort: false,
      },
      status: {
        title: 'Status',
        sort: false,
      },
      sender: {
        title: 'Sent by',
        sort: false,
      },
      expdays: {
        title: 'Expiry Days',
        sort: false,
      },
    },
  };

  listViewBuilder: (docs: DocumentModel[]) => any = (docs: DocumentModel[]) => {
    const items = [];
    this.assetList = docs;
    for (const doc of docs) {
      items.push(new DocumentListViewItem({
        uid: doc.uid,
        icon: { url: '/assets/images/App-Library-Package.png' },
        // receipient: doc.get('The_Loupe_Delivery:delivery_email'),
        receipient: doc.get('The_Loupe_Delivery:slingshot_delivery_email').join(', '),
        date: doc.get('dc:created'),
        sender: doc.get('dc:creator'),
      }));
      this.historyList.push(new PackageHistoryListViewItem({
        uid: doc.uid,
        history: doc.get('The_Loupe_Delivery:status_history'),
      }));
    }
    return items;
  }

  listViewBuilderHistory: (docs: DocumentModel[], uid: string) => any = (docs: DocumentModel[], uid: string) => {
    const items = [];
    for (const doc of docs) {
      items.push(new DocumentListViewItem({
        uid,
        date: doc['date'],
        recipient: doc['recipient'],
        status: doc['status'],
        sender: doc['sender'],
        expdays: doc['expiry_days'],
      }));
    }
    return items;
  }

  constructor(
    protected documentPageService: DocumentPageService,
    protected componentFactoryResolver: ComponentFactoryResolver,
  ) {
    super(documentPageService, componentFactoryResolver);
  }

  changeMenuView(name: string, type: string, formMode: string): void {
    this.triggerChangeView(name, type,
      new CreativeProjectMgtSettings({
        document: (formMode === 'edit' && this.packageDocument) ? this.packageDocument : this.document,
        dialogDocument: (formMode === 'edit' && this.packageDocument) ? this.packageDocument : this.document,
        project: this.templateSettings.project,
        homeTemplate: 'creative-project-mgt-template',
        homePage: 'delivery-page',
        homeView: 'package-home-view',
        formMode,
        showMessageBeforeSave: false,
        buttonGroup: [
          {
            label: (formMode === 'create') ? 'Send' : 'Resend',
            name: (formMode === 'create') ? 'Send' : 'Resend',
            type: 'custom',
            disabled: (status: DocumentFormStatus) => status.submitted || !status.formValid,
            triggerSave: true,
          },
          {
            label: 'Save draft',
            name: 'Save draft',
            type: 'save',
          },
        ],
      }));
  }

  protected beforeSetDocument(doc: DocumentModel, user: UserModel, formSettings: CreativeProjectMgtSettings): Observable<DocumentModel> {
    this.navSettings = this.buildNavSettings(doc);
    return observableOf(doc);
  }

  protected buildNavSettings(doc: DocumentModel): any {
    return new ProjectMgtNavigationSettings({
      currentPage: 'delivery-page',
      searchFormParams: this.buildAssetParams(doc),
      searchFormSettings: new GlobalSearchFormSettings({
        source: 'document-creative-project-delivery-package',
        searchGroupPosition: 'right',
        enableSearchForm: false,
      }),
    });
  }

  onSelected(row: any): void {
    this.packageDocument = this.assetList.filter((item: any) => item.uid === row.data.uid)[0];
    this.showHistory(row.data);
  }

  protected buildAssetParams(doc: DocumentModel): GlobalSearchParams {
    const params: any = {
      ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_DELIVERY_PACKAGE_TYPE,
      currentPageIndex: 0,
      ecm_fulltext: '',
    };
    if (doc) {
      params['ecm_path'] = doc.path;
    }
    return new GlobalSearchParams(params);
  }

  protected showHistory(data: any): any {
    if (data) {
      this.historyItemList = this.listViewBuilderHistory(this.historyList.filter((x: any) => x.uid === data.uid)[0].history, data.uid);
    }
  }
}
