import { Component, Input } from '@angular/core';
import { DocumentModel } from '@core/api';
import { Subject, timer } from 'rxjs';
import { NUXEO_DOC_TYPE } from '@environment/environment';
import { GlobalSearchFormSettings } from '../../../global-search-form/global-search-form.interface';
import { ListSearchRowCustomViewComponent } from '../../../list-search-form-in-dialog';
import { ListSearchRowCustomViewSettings } from '../../../list-search-form/list-search-form.interface';
import { DocumentListViewItem } from '../../../document-list-view/document-list-view.interface';
import { assetPath } from '@core/services/helpers';
@Component({
  selector: 'document-creative-project-import-requests-view',
  styleUrls: ['../../document-creative-project-mgt.component.scss'],
  templateUrl: './document-creative-project-import-requests-view.component.html',
})
export class DocumentCreativeProjectImportRequestsViewComponent {
  @Input()
  set document(doc: DocumentModel) {
    if (doc) {
      this.doc = doc;
      this.loading = false;
      timer(0).subscribe(() => { this.baseParams$.next(this.buildAssetParams(doc)); });
    }
  }
  doc: DocumentModel;
  loading: boolean = true;
  baseParams$: Subject<any> = new Subject<any>();
  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    schemas: ['dublincore', 'The_Loupe_Main', 'The_Loupe_Delivery', 'collection'],
    source: 'document-creative-project-import-requests-view',
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
                <li>Uploader:</li>
                <li>Requested By:</li>
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
  listViewBuilder: (docs: DocumentModel[]) => any = (docs: DocumentModel[]) => {
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
  protected buildAssetParams(doc: DocumentModel): any {
    const params: any = {
      ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_IMPORT_REQUEST_TYPE,
      ecm_path: doc.path,
      currentPageIndex: 0,
      ecm_fulltext: '',
    };
    if (doc) {
      params['the_loupe_main_jobtitle_any'] = `["${doc.get('The_Loupe_Main:jobtitle')}"]`;
    }
    return params;
  }
  onSelected(row: any): void {
    window.open('/#/p/creative/project/' + this.doc.uid + '/request/' + row.data.uid + '/import', '_blank');
  }
}
