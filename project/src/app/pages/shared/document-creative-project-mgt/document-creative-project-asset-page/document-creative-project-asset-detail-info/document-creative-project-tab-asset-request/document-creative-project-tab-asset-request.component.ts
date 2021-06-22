import { Component, ComponentFactoryResolver } from '@angular/core';
import { DocumentModel } from '@core/api';
import { DocumentPageService } from '../../../../services/document-page.service';
import { Subject, timer } from 'rxjs';
import { NUXEO_DOC_TYPE } from '@environment/environment';
import { DocumentListViewItem } from '../../../../../shared/document-list-view/document-list-view.interface';
import { GlobalSearchFormSettings } from '../../../../../shared/global-search-form/global-search-form.interface';
import { ListSearchRowCustomViewSettings } from '../../../../../shared/list-search-form/list-search-form.interface';
import { ListSearchRowCustomViewComponent } from '../../../../../shared/list-search-form-in-dialog/list-search-row-custom-view-component';
import { DocumentCreativeProjectMgtBaseComponent } from '../../../document-creative-project-mgt-base.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'document-creative-project-tab-asset-request',
  styleUrls: ['../../../document-creative-project-mgt.component.scss', './document-creative-project-tab-asset-request.component.scss'],
  templateUrl: './document-creative-project-tab-asset-request.component.html',
})
export class DocumentCreativeProjectTabAssetRequestComponent extends DocumentCreativeProjectMgtBaseComponent {

  loading: boolean = true;

  document: DocumentModel;

  baseParams$: Subject<any> = new Subject<any>();

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    source: 'document-creative-project-asset-request',
    enableSearchInput: false,
  });

  listViewSettings: any = {
    hideHeader: false,
    hideSubHeader: true,
    columns: {
      title: {
        title: 'Title',
        sort: false,
        type: 'custom',
        renderComponentData: new ListSearchRowCustomViewSettings({
          viewType: 'icon',
        }),
        renderComponent: ListSearchRowCustomViewComponent,
      },
      date: {
        title: 'Request Date',
        sort: false,
        valuePrepareFunction: (value: any) => {
          return value ? new DatePipe('en-US').transform(value, 'yyyy-MM-dd') : null;
        },
      },
      requestUser: {
        title: 'Request User',
        sort: false,
      },
      status: {
        title: 'Status',
        sort: false,
      },
      mediatypes: {
        title: 'Usage Mediatypes',
        sort: false,
      },
      start: {
        title: 'Usage Start',
        sort: false,
      },
      period: {
        title: 'Usage Period',
        sort: false,
      },
      countries: {
        title: 'Usage Countries',
        sort: false,
      },
      approved: {
        title: 'Approved By',
        sort: false,
      },
    },
  };

  constructor(
    protected documentPageService: DocumentPageService,
    protected componentFactoryResolver: ComponentFactoryResolver,
  ) {
    super(documentPageService, componentFactoryResolver);
  }

  setDocument(doc: DocumentModel): void {
    if (doc) {
      this.document = doc;
      this.loading = false;
      timer(0).subscribe(() => { this.baseParams$.next(this.buildAssetParams(doc)); });
    }
  }

  listViewBuilder: (docs: DocumentModel[]) => any = (docs: DocumentModel[]) => {
    const items = [];
    for (const doc of docs) {
      items.push(new DocumentListViewItem({
        uid: doc.uid,
        title: doc,
        date: doc.get('The_Loupe_Delivery:request_date'),
        requestUser: doc.get('The_Loupe_Delivery:request_user'),
        status: doc.get('The_Loupe_Delivery:status'),
        mediatypes: doc.get('The_Loupe_Rights:contract_mediatypes'),
        start: doc.get('The_Loupe_Delivery:usage_start'),
        period: doc.get('The_Loupe_Delivery:usage_end'),
        countries: doc.get('The_Loupe_Delivery:usage_country').join(','),
        approved: doc.get('The_Loupe_Delivery:approved_by'),
      }));
    }
    return items;
  }

  protected buildAssetParams(doc: DocumentModel): any {
    const params: any = {
      ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_ASSET_REQUEST_TYPE,
      currentPageIndex: 0,
      ecm_fulltext: '',
    };
    if (doc) {
      params['ecm_path'] = doc.path;
    }
    return params;
  }

}
