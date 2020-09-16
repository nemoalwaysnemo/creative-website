import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DocumentModel, NuxeoApiService, NuxeoAutomations, NuxeoPagination, NuxeoRequestOptions } from '@core/api';
import { Subject, timer } from 'rxjs';
import { ListSearchRowCustomViewComponent } from '../../list-search-form';
import { ListSearchRowCustomViewSettings } from '../../list-search-form/list-search-form.interface';
import { DocumentListViewItem } from '../../document-list-view/document-list-view.interface';
import { GlobalSearchFormSettings } from '../../global-search-form/global-search-form.interface';
import { NUXEO_DOC_TYPE } from '@environment/environment';

@Component({
  selector: 'document-creative-project-related-asset',
  styleUrls: ['../document-creative-project-mgt.component.scss'],
  templateUrl: './document-creative-project-related-asset.component.html',
})
export class DocumentCreativeProjectRelatedAssetComponent {

  constructor(
    protected nuxeoApi: NuxeoApiService,
  ) {
  }

  @Input()
  set showButton(show: boolean) {
    this.showStatus = show;
  }

  @Input()
  set document(doc: DocumentModel) {
    if (doc) {
      if (this.showStatus) {
        timer(0).subscribe(() => { this.baseParams$.next(this.buildAssetParams(doc, doc.getParent('brand'))); });
        this.loading = false;
      } else {
        this.buildAssetData(doc);
      }
    }
  }

  @Input()
  set listViewOptions(settings: any) {
    if (settings) {
      if (settings.deliverPackage) {
        this.isPackage = settings.deliverPackage;
        delete settings.deliverPackage;
      }
      this.listViewSettings = Object.assign({}, this.defaultSettings, settings);
    } else {
      this.listViewSettings = this.defaultSettings;
    }
  }

  static readonly NAME: string = 'creative-project-related-asset';

  loading: boolean = true;

  baseParams$: Subject<any> = new Subject<any>();

  isPackage: boolean = false;

  selectedRows: any = [];

  listViewSettings: any;

  isRefresh: boolean = true;

  assetList: DocumentModel[] = [];

  showStatus: boolean = true;

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    schemas: ['dublincore', 'The_Loupe_Main', 'The_Loupe_Delivery', 'The_Loupe_Credits', 'The_Loupe_ProdCredits', 'The_Loupe_Rights'],
    source: 'document-creative-project-related-asset',
    enableSearchInput: false,
  });

  defaultSettings: any = {
    hideHeader: true,
    hideSubHeader: true,
    selectMode: 'single',
    columns: {
      title: {
        title: 'Title',
        sort: false,
      },
      type: {
        title: 'Asset Type',
        sort: false,
      },
      action: {
        title: 'Icon',
        sort: false,
        type: 'custom',
        renderComponentData: new ListSearchRowCustomViewSettings({
          viewType: 'thumbnail',
        }),
        renderComponent: ListSearchRowCustomViewComponent,
      },
    },
  };

  @Output() onRowSelected: EventEmitter<any> = new EventEmitter<any>();

  listViewBuilder: Function = (docs: DocumentModel[]): any => {
    const items = [];
    for (const doc of docs) {
      items.push(new DocumentListViewItem({
        uid: doc.uid,
        title: doc.title,
        type: doc.get('The_Loupe_Main:assettype'),
        action: doc,
      }));
    }
    return items;
  }

  onSelected(row: any): void {
    this.onRowSelected.emit(row);
  }

  protected getStatus(doc: DocumentModel): void {
    const status = doc.get('The_Loupe_Delivery:status');
    if (status) {
      // this.showButton = false;
    }
  }

  protected buildAssetParams(doc: DocumentModel, brand: DocumentModel): any {
    const params: any = {
      ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES,
      currentPageIndex: 0,
      ecm_fulltext: '',
    };
    if (doc) {
      params['ecm_uuid_not_eq'] = doc.uid;
      params['the_loupe_main_jobtitle_any'] = `["${doc.get('The_Loupe_Main:jobtitle')}"]`;
    }
    if (brand) {
      params['ecm_path'] = brand.path;
    }
    return params;
  }

  protected buildAssetData(doc: DocumentModel): any {
    const uid: string = doc.uid;
    const schemas: string[] = ['video', 'picture', 'app_global', 'app_global_fields', 'app_Edges', 'The_Loupe_Main', 'The_Loupe_ProdCredits', 'The_Loupe_Rights'];
    if (uid.length > 0) {
      this.nuxeoApi.operation(NuxeoAutomations.GetDocumentsFromCollection, {}, uid, new NuxeoRequestOptions({ schemas })).subscribe((response: NuxeoPagination) => {
        this.assetList = this.listViewBuilder(response.entries);
        this.loading = false;
      });
    }
  }
}
