import { Component, ComponentFactoryResolver } from '@angular/core';
import { NbMenuItem } from '@core/nebular/theme';
import { DocumentModel, UserModel } from '@core/api';
import { DocumentListViewItem } from '../../../document-list-view/document-list-view.interface';
import { GlobalSearchFormSettings } from '../../../global-search-form/global-search-form.interface';
import { ListSearchRowCustomViewSettings } from '../../../list-search-form/list-search-form.interface';
import { ListSearchRowCustomViewComponent } from '../../../list-search-form-in-dialog/list-search-row-custom-view-component';
import { DocumentCreativeProjectMgtBaseComponent } from '../../document-creative-project-mgt-base.component';
import { ProjectMgtNavigationSettings } from '../../shared/document-creative-project-navigation/document-creative-project-navigation.interface';
import { CreativeProjectMgtSettings } from '../../document-creative-project-mgt.interface';
import { GlobalDocumentDialogService } from '../../../global-document-dialog/global-document-dialog.service';
import { DocumentPageService, GlobalEvent } from '../../../services/document-page.service';
import { DocumentFormStatus } from '../../../document-form/document-form.interface';
import { of as observableOf, Observable } from 'rxjs';
import { NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'document-creative-project-3rd-import-request-page',
  styleUrls: ['../../document-creative-project-mgt.component.scss'],
  templateUrl: './document-creative-project-3rd-party-import-request-page.component.html',
})
export class DocumentCreativeProject3rdImportRequestComponent extends DocumentCreativeProjectMgtBaseComponent {

  actions: NbMenuItem[] = [
    {
      id: '3rd-import-new-request',
      title: 'Request Import',
      type: 'view',
    },
  ];

  defaultParams: any = {
    ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES,
    currentPageIndex: 0,
    ecm_fulltext: '',
  };

  navSettings: ProjectMgtNavigationSettings;

  searchFormSettingsAsset: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    schemas: ['dublincore', 'The_Loupe_Main', 'The_Loupe_Delivery'],
    source: 'document-creative-project-3rd-party-import-request',
    enableSearchForm: false,
    autoSearch: false,
  });

  listViewSettingsAsset: any = {
    hideHeader: true,
    hideSubHeader: true,
    columns: {
      action: {
        title: 'Action',
        sort: false,
        type: 'custom',
        renderComponentData: new ListSearchRowCustomViewSettings({
          viewType: 'thumbnail',
          enableClick: true,
        }),
        renderComponent: ListSearchRowCustomViewComponent,
      },
      title: {
        title: 'Title',
        sort: false,
      },
    },
  };

  listViewBuilderAsset: (docs: DocumentModel[]) => any = (docs: DocumentModel[]) => {
    const items = [];
    for (const doc of docs) {
      items.push(new DocumentListViewItem({
        uid: doc.uid,
        title: doc.title,
        action: doc,
      }));
    }
    return items;
  }

  constructor(
    protected documentPageService: DocumentPageService,
    protected componentFactoryResolver: ComponentFactoryResolver,
    protected globalDocumentDialogService: GlobalDocumentDialogService,
  ) {
    super(documentPageService, componentFactoryResolver, globalDocumentDialogService);
    this.subscribeHomeEvents();
  }

  changeMenuView(name: string, type: string, formMode: string): void {
    this.triggerChangeView(name, type,
      new CreativeProjectMgtSettings({
        document: this.document,
        project: this.templateSettings.project,
        homeTemplate: 'creative-project-mgt-template',
        homePage: '3rd-import-Page',
        homeView: '3rd-import-home-view',
        formMode,
        showMessageBeforeSave: false,
        buttonGroup: [
          {
            label: 'create',
            name: 'create',
            type: 'custom',
            disabled: (status: DocumentFormStatus) => status.submitted || !status.formValid,
            triggerSave: true,
          },
          {
            label: 'cancel',
            name: 'cancel',
            type: 'cancel',
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
      currentPage: '3rd-import-Page',
      searchFormParams: this.buildAssetParams(doc),
      searchFormSettings: new GlobalSearchFormSettings({
        schemas: ['dublincore', 'The_Loupe_Main', 'The_Loupe_Delivery'],
        source: 'document-creative-project-3rd-party-import-request',
        searchGroupPosition: 'right',
        enableSearchForm: false,
      }),
    });
  }

  private buildAssetParams(doc: DocumentModel): any {
    const params: any = {
      ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES,
      currentPageIndex: 0,
      ecm_fulltext: '',
      pageSize: 100,
    };
    // if (doc) {
    //   params['ecm_path'] = doc.path;
    // }
    return params;
  }

  private subscribeHomeEvents(): void {
    const subscription = this.documentPageService.onEventType('list-search-row-custom-view').subscribe((event: GlobalEvent) => {
      this.triggerChangeView('asset-detail-view', 'view', new CreativeProjectMgtSettings({ project: this.document, document: event.data.document }));
    });
    this.subscription.add(subscription);
  }

}
