import { Component, Input } from '@angular/core';
import { DocumentModel } from '@core/api';
import { Subject, timer } from 'rxjs';
import { assetPath } from '@core/services/helpers';
import { ListSearchRowCustomViewComponent } from '../../list-search-form';
import { ListSearchRowCustomViewSettings } from '../../list-search-form/list-search-form.interface';
import { DocumentListViewItem } from '../../document-list-view/document-list-view.interface';
import { GlobalSearchFormSettings } from '../../global-search-form/global-search-form.interface';
import { NUXEO_PATH_INFO, NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'document-creative-project-delivery-package',
  styleUrls: ['../document-creative-project-mgt.component.scss'],
  templateUrl: './document-creative-project-delivery-package.component.html',
})
export class DocumentCreativeProjectDeliveryPackageComponent {

  loading: boolean = true;

  doc: DocumentModel;

  baseParams$: Subject<any> = new Subject<any>();

  selectedRows: any = [];

  showInfo: boolean = false;

  packageDocument: DocumentModel;

  showButton: boolean = false;

  listViewOptionsPackage: any = {
    deliverPackage: false,
  };

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    schemas: ['dublincore', 'The_Loupe_Main', 'The_Loupe_Delivery', 'collection'],
    source: 'document-creative-project-delivery-package',
    enableSearchInput: false,
  });

  listViewSettings: any = {
    hideHeader: true,
    hideSubHeader: true,
    columns: {
      icon: {
        title: 'Icon',
        sort: false,
        type: 'custom',
        renderComponentData: new ListSearchRowCustomViewSettings({
          viewType: 'icon',
        }),
        renderComponent: ListSearchRowCustomViewComponent,
      },
      title: {
        sort: false,
        type: 'custom',
        renderComponentData: new ListSearchRowCustomViewSettings({
          viewType: 'html',
          htmlFunc: (doc: DocumentModel) => {
            return `
            <div class="delivery-title">
              <ul>
                <li>Recipient:</li>
                <li>Send By:</li>
                <li>Status:</li>
              </ul>
            </div>`;
          },
        }),
        renderComponent: ListSearchRowCustomViewComponent,
      },
      info: {
        sort: false,
        type: 'custom',
        renderComponentData: new ListSearchRowCustomViewSettings({
          viewType: 'html',
          htmlFunc: (doc: DocumentModel) => {
            return `
            <div class="delivery-info">
              <ul>
                <li>${doc.get('The_Loupe_Delivery:delivery_email')}</li>
                <li>${doc.get('dc:creator')}</li>
                <li>${doc.get('The_Loupe_Delivery:status')}</li>
              </ul>
            </div>`;
          },
        }),
        renderComponent: ListSearchRowCustomViewComponent,
      },
    },
  };

  listViewBuilder: Function = (docs: DocumentModel[]): any => {
    const items = [];
    for (const doc of docs) {
      items.push(new DocumentListViewItem({
        uid: doc.uid,
        icon: { url: assetPath('assets/images/App-Library-Package.png') },
        title: doc,
        info: doc,
      }));
    }
    return items;
  }

  @Input()
  set document(doc: DocumentModel) {
    if (doc) {
      this.doc = doc;
      this.loading = false;
      timer(0).subscribe(() => { this.baseParams$.next(this.buildAssetParams(doc, doc.getParent('brand'))); });
    }
  }

  onSelected(row: any): void {
    this.selectedRows = row.selected;
    this.showInfo = true;
    this.packageDocument = row.selected[0].title;
  }

  onResponse(e: any): void {
    if (e === 'back') {
      this.showInfo = false;
    }
  }

  protected buildAssetParams(doc: DocumentModel, brand: DocumentModel): any {
    const params: any = {
      ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_DELIVERY_PACKAGE_TYPE,
      ecm_path: NUXEO_PATH_INFO.CREATIVE_TBWA_FOLDER_PATH,
      currentPageIndex: 0,
      ecm_fulltext: '',
    };
    if (doc) {
      params['the_loupe_main_jobtitle_any'] = `["${doc.get('The_Loupe_Main:jobtitle')}"]`;
    }
    return params;
  }

}
