import { Component, Input, Output, EventEmitter, ComponentFactoryResolver } from '@angular/core';
import { DocumentModel, NuxeoAutomations, NuxeoPagination, SearchResponse } from '@core/api';
import { isValueEmpty } from '@core/services/helpers';
import { DatePipe } from '@angular/common';
import { Subject, timer, of as observableOf, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ListSearchRowCustomViewComponent } from '../../../list-search-form-in-dialog';
import { ListSearchRowCustomViewSettings } from '../../../list-search-form/list-search-form.interface';
import { DocumentListViewItem } from '../../../document-list-view/document-list-view.interface';
import { DocumentCreativeProjectMgtBaseComponent } from '../../document-creative-project-mgt-base.component';
import { GlobalDocumentDialogService } from '../../../global-document-dialog/global-document-dialog.service';
import { DocumentPageService, GlobalEvent } from '../../../../shared/services/document-page.service';
import { NUXEO_DOC_TYPE, NUXEO_PATH_INFO } from '@environment/environment';

@Component({
  selector: 'document-creative-project-related-asset',
  styleUrls: ['../../document-creative-project-mgt.component.scss', './document-creative-project-related-asset.component.scss'],
  templateUrl: './document-creative-project-related-asset.component.html',
})
export class DocumentCreativeProjectRelatedAssetComponent extends DocumentCreativeProjectMgtBaseComponent {

  static readonly NAME: string = 'creative-project-related-asset';

  loading: boolean = true;

  enButtonClick: boolean = false;

  listViewSettings: any;

  packageViewSettings: any;

  formViewSettings: any;

  doc: DocumentModel;

  assetList: DocumentModel[] = [];

  searchFormSettings: any;

  baseParamsSelected$: Subject<any> = new Subject<any>();

  baseParamsLinkBrand$: Subject<any> = new Subject<any>();

  baseParamsLinkProject$: Subject<any> = new Subject<any>();

  baseParamsRelatedAssets$: Subject<any> = new Subject<any>();

  defaultSettings: any = {
    hideHeader: false,
    hideSubHeader: true,
    selectMode: 'multi',
    columns: {
      action: {
        sort: false,
        type: 'custom',
        renderComponentData: new ListSearchRowCustomViewSettings({
          viewType: 'thumbnail',
        }),
        renderComponent: ListSearchRowCustomViewComponent,
      },
      title: {
        title: 'Title',
        sort: false,
      },
      type: {
        title: 'Assettype',
        sort: false,
      },
      date: {
        title: 'Live Date',
        sort: false,
        valuePrepareFunction: (value: any) => {
          return value ? new DatePipe('en-US').transform(value, 'yyyy-MM-dd') : null;
        },
      },
      usageRights: {
        title: 'UR Forecast',
        sort: false,
        type: 'custom',
        renderComponentData: new ListSearchRowCustomViewSettings({
          viewType: 'usage-rights-expiry',
        }),
        renderComponent: ListSearchRowCustomViewComponent,
      },
    },
  };

  @Input()
  set listViewOptions(settings: any) {
    if (settings) {
      this.listViewSettings = Object.assign({}, this.defaultSettings, settings);
    } else {
      this.listViewSettings = this.defaultSettings;
    }
  }

  @Input()
  set assetSettings(settings: any) {
    if (!isValueEmpty(settings)) {
      this.packageViewSettings = Object.assign({}, this.packageViewSettings, settings);
    }
  }

  @Input()
  set searchSettings(settings: any) {
    if (!isValueEmpty(settings)) {
      this.searchFormSettings = Object.assign({}, this.searchFormSettings, settings);
    }
  }

  @Input()
  set formSettings(settings: any) {
    if (!isValueEmpty(settings)) {
      this.formViewSettings = settings;
    }
  }

  @Output() assetSelected: EventEmitter<any> = new EventEmitter<any>();

  @Output() assetAction: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    protected documentPageService: DocumentPageService,
    protected componentFactoryResolver: ComponentFactoryResolver,
    protected globalDocumentDialogService: GlobalDocumentDialogService,
  ) {
    super(documentPageService, componentFactoryResolver, globalDocumentDialogService);
  }

  protected setDocument(doc: DocumentModel): void {
    if (doc) {
      this.doc = doc;
      timer(0).subscribe(() => { this.buildAssetParams(doc); });
      this.loading = false;
    }
  }

  listViewBuilder: (docs: DocumentModel[]) => any = (docs: DocumentModel[]) => {
    const items = [];
    for (const doc of docs) {
      items.push(new DocumentListViewItem({
        uid: doc.uid,
        action: doc,
        title: doc.title,
        type: doc.get('The_Loupe_Main:assettype'),
        docView: doc,
        date: doc.get('The_Loupe_Rights:first-airing'),
        usageRights: doc.get('_usage_rights_'),
      }));
    }
    return items;
  };

  afterSearch: (res: SearchResponse) => Observable<SearchResponse> = (res: SearchResponse) => {
    return this.getUsageRightsStatus(res);
  };

  onSelected(event: any): void {
    event.selectedType = this.packageViewSettings.type;
    this.assetSelected.emit(event);
  }

  onCheckedChange($event: Event): void {
    if (($event.target as HTMLInputElement).checked) {
      this.assetAction.emit({
        act: 'changeProject',
      });
    } else {
      this.assetAction.emit({
        act: 'changeBrand',
      });
    }
  }

  onClick(data: any): void {
    this.documentPageService.triggerEvent(new GlobalEvent({ name: data.type, type: 'mgt-delivery-package', data: { settings: this.packageViewSettings } }));
  }

  protected buildAssetParams(doc: any): void {
    switch (this.packageViewSettings.type) {
      case 'assetSelected':
        this.enButtonClick = true;
        this.baseParamsSelected$.next(this.buildSelectedAssetsParams(doc));
        break;
      case 'linkBrand':
        this.enButtonClick = true;
        this.baseParamsLinkBrand$.next(this.buildLinkAssetsBrandParams(doc));
        break;
      case 'linkProject':
        this.enButtonClick = true;
        this.baseParamsLinkProject$.next(this.buildLinkAssetsProjectParams(doc));
        break;
      case 'linkRelated':
        this.enButtonClick = false;
        this.baseParamsRelatedAssets$.next(this.buildRelatedAssetsParams(doc, doc.getParent('brand')));
        break;
      case 'assetRelatedSelected':
        this.enButtonClick = false;
        this.buildSelectedRelatedAssetsParams(doc);
        break;
      default:
        break;
    }
  }

  protected buildSelectedRelatedAssetsParams(docs?: DocumentModel[]): any {
    if (docs) {
      this.assetList = this.listViewBuilder(docs);
    }
  }

  protected buildSelectedAssetsParams(doc: DocumentModel): any {
    const params: any = {
      ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES,
      currentPageIndex: 0,
      ecm_fulltext: '',
    };
    if (doc) {
      params['collectionIds_any'] = `["${doc.uid}"]`;
    }
    return params;
  }

  protected buildLinkAssetsBrandParams(doc: DocumentModel): any {
    const params: any = {
      ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES,
      ecm_path: NUXEO_PATH_INFO.CREATIVE_TBWA_FOLDER_PATH,
      currentPageIndex: 0,
      ecm_fulltext: '',
    };
    if (doc) {
      params['the_loupe_main_agency'] = doc.get('The_Loupe_Main:agency');
      params['the_loupe_main_brand'] = doc.get('The_Loupe_Main:brand');
      params['collectionIds_not_in'] = `["${doc.uid}"]`;
    }
    return params;
  }

  protected buildLinkAssetsProjectParams(doc: DocumentModel): any {
    const params: any = {
      ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES,
      currentPageIndex: 0,
      ecm_fulltext: '',
    };
    if (doc) {
      params['collectionIds_not_in'] = `["${doc.uid}"]`;
      params['the_loupe_main_jobtitle_any'] = `["${doc.get('The_Loupe_Main:jobtitle')}"]`;
    }
    return params;
  }

  protected buildRelatedAssetsParams(doc: DocumentModel, brand: DocumentModel): any {
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

  private getUsageRightsStatus(res: SearchResponse): Observable<SearchResponse> {
    const uids: string[] = res.response.entries.map((doc: DocumentModel) => doc.uid);
    if (uids.length > 0) {
      return this.documentPageService.operation(NuxeoAutomations.GetDocumentURStatus, { uuids: `${uids.join(',')}`, entityType: 'asset' }).pipe(
        map((response: NuxeoPagination) => {
          res.response.entries.forEach((doc: DocumentModel) => {
            const status = response.entries.find((x: any) => x.uuid === doc.uid);
            doc.setProperty('_usage_rights_', status || {}, true);
          });
          return res;
        }),
      );
    }
    return observableOf(res);
  }
}
