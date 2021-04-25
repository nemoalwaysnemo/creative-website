import { Component, ComponentFactoryResolver } from '@angular/core';
import { NbMenuItem } from '@core/nebular/theme';
import { DocumentModel, UserModel } from '@core/api';
import { DocumentListViewItem } from '../../../document-list-view/document-list-view.interface';
import { GlobalSearchFormSettings } from '../../../global-search-form/global-search-form.interface';
import { ListSearchRowCustomViewSettings } from '../../../list-search-form/list-search-form.interface';
import { ListSearchRowCustomViewComponent } from '../../../list-search-form-in-dialog/list-search-row-custom-view-component';
import { DocumentCreativeProjectMgtBaseComponent } from '../../document-creative-project-mgt-base.component';
import { ProjectMgtNavigationSettings } from '../../shared/document-creative-project-navigation/document-creative-project-navigation.interface';
import { DocumentCreativeProjectAssetDetailComponent } from '../document-creative-project-asset-detail/document-creative-project-asset-detail.component';
import { CreativeProjectMgtSettings } from '../../document-creative-project-mgt.interface';
import { DocumentPageService, GlobalEvent } from '../../../services/document-page.service';
import { of as observableOf, Observable } from 'rxjs';
import { NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'document-creative-project-asset-home',
  styleUrls: ['../../document-creative-project-mgt.component.scss', '../document-creative-project-asset-page.component.scss'],
  templateUrl: './document-creative-project-asset-home.component.html',
})
export class DocumentCreativeProjectAssetHomeComponent extends DocumentCreativeProjectMgtBaseComponent {

  actions: NbMenuItem[] = [
    {
      id: 'import',
      title: 'Import',
      type: 'page',
    },
    {
      id: '3rd-import',
      title: 'Create 3rd Party Import',
      type: 'page',
    },
    {
      id: 'delivery',
      title: 'Create Delivery Package',
      type: 'page',
    },
    {
      id: 'modif-assets',
      title: ' Modify Assets',
    },
    {
      id: 'set-usage-rights',
      title: ' Set Usage Rights',
      type: 'page',
    },
  ];

  defaultParams: any = {
    ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES,
    currentPageIndex: 0,
    ecm_fulltext: '',
  };

  navSettings: ProjectMgtNavigationSettings;

  searchFormSettingsAsset: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    source: 'document-creative-project-asset',
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
  ) {
    super(documentPageService, componentFactoryResolver);
    this.subscribeHomeEvents();
  }

  onMenuClick(item: NbMenuItem): void {
    this.triggerChangeView(item.id, item.type);
  }

  protected beforeSetDocument(doc: DocumentModel, user: UserModel, formSettings: CreativeProjectMgtSettings): Observable<DocumentModel> {
    this.navSettings = this.buildNavSettings(doc);
    return observableOf(doc);
  }

  private buildNavSettings(doc: DocumentModel): any {
    return new ProjectMgtNavigationSettings({
      currentPage: 'asset-page',
      searchFormParams: this.buildAssetParams(doc),
      searchFormSettings: new GlobalSearchFormSettings({
        source: 'document-creative-project-asset',
        searchGroupPosition: 'right',
      }),
    });
  }

  private buildAssetParams(doc: DocumentModel): any {
    const params: any = {
      ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES,
      currentPageIndex: 0,
      ecm_fulltext: '',
    };
    // if (doc) {
    //   params['ecm_path'] = doc.path;
    // }
    return params;
  }

  private subscribeHomeEvents(): void {
    const subscription = this.documentPageService.onEventType('list-search-row-custom-view').subscribe((event: GlobalEvent) => {
      this.triggerChangeView('asset-detail-view', 'view', new CreativeProjectMgtSettings({ document: event.data.document }));
    });
    this.subscription.add(subscription);
  }

}
