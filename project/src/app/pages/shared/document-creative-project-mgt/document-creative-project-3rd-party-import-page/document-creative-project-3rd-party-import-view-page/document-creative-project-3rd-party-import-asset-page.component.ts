import { Component, Input, ComponentFactoryResolver } from '@angular/core';
import { DocumentModel, NuxeoRequestOptions, NuxeoPagination } from '@core/api';
import { Subject, timer, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NUXEO_DOC_TYPE } from '@environment/environment';
import { DocumentPageService } from '../../../services/document-page.service';
import { GlobalSearchFormSettings } from '../../../global-search-form/global-search-form.interface';
import { ListSearchRowCustomViewComponent } from '../../../list-search-form-in-dialog';
import { ListSearchRowCustomViewSettings } from '../../../list-search-form/list-search-form.interface';
import { DocumentListViewItem } from '../../../document-list-view/document-list-view.interface';
import { DocumentCreativeProjectMgtBasePageComponent } from '../../document-creative-project-mgt-base-page.component';
import { DocumentCreativeProjectImportNewRequestComponent } from '../document-creative-project-3rd-party-import-new-request/document-creative-project-import-new-request.component';
import { CreativeProjectMgtSettings } from '../../document-creative-project-mgt.interface';
import { DocumentFormStatus } from '@pages/shared/document-form/document-form.interface';
@Component({
  selector: 'creative-brand-project-3rd-party-import',
  templateUrl: './document-creative-project-3rd-party-import-asset-page.component.html',
  styleUrls: ['../../../../../theme/styles/document-metadata-view.scss'],
})
export class CreativeBrandProject3rdPartyImportComponent extends DocumentCreativeProjectMgtBasePageComponent {

  constructor(
    protected documentPageService: DocumentPageService,
    protected componentFactoryResolver: ComponentFactoryResolver,
  ) {
    super(documentPageService, componentFactoryResolver);
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
          htmlFn: (doc: DocumentModel) => {
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
          htmlFn: (doc: DocumentModel) => {
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


  protected setDocument(doc: DocumentModel): void {
    if (doc) {
      this.doc = doc;
      this.loading = false;
      timer(0).subscribe(() => { this.baseParams$.next(this.buildAssetParams(doc)); });
    }
  }

  changeToCreateView(): void {
    this.changeView(DocumentCreativeProjectImportNewRequestComponent);
  }

  listViewBuilder: (docs: DocumentModel[]) => any = (docs: DocumentModel[]) => {
    const items = [];
    for (const doc of docs) {
      items.push(new DocumentListViewItem({
        uid: doc.uid,
        icon: { url: '/assets/images/App-Library-Package.png' },
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
    this.getRequestDocument(row.data.info);
  }

  getRequestDocument(request_doc: DocumentModel): void {
    this.changeMenuView('3rd-import-request-review', 'view', 'edit', request_doc);
  }

  changeMenuView(name: string, type: string, formMode: string, request_doc: DocumentModel): void {
    this.triggerChangeView(name, type,
      new CreativeProjectMgtSettings({
        document: request_doc,
        // dialogDocument: request_doc,
        project: this.templateSettings.project,
        homeTemplate: 'creative-project-mgt-template',
        homePage: '3rd-import-Page',
        homeView: '3rd-import-home-view',
        formMode,
        showMessageBeforeSave: false,
      }));
  }
}
