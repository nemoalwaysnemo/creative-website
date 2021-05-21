import { Component, Input, Output, EventEmitter, ComponentFactoryResolver } from '@angular/core';
import { DocumentModel } from '@core/api';
import { Subject, timer } from 'rxjs';
import { ListSearchRowCustomViewComponent } from '../../../list-search-form-in-dialog';
import { ListSearchRowCustomViewSettings } from '../../../list-search-form/list-search-form.interface';
import { DocumentListViewItem } from '../../../document-list-view/document-list-view.interface';
import { GlobalSearchFormSettings } from '../../../global-search-form/global-search-form.interface';
import { NUXEO_DOC_TYPE, NUXEO_PATH_INFO } from '@environment/environment';
import { DatePipe } from '@angular/common';
import { DocumentCreativeProjectMgtBaseComponent } from '../../document-creative-project-mgt-base.component';
import { DocumentPageService } from '../../../../shared/services/document-page.service';

@Component({
  selector: 'document-creative-project-related-asset',
  styleUrls: ['../../document-creative-project-mgt.component.scss', './document-creative-project-related-asset.component.scss'],
  templateUrl: './document-creative-project-related-asset.component.html',
})
export class DocumentCreativeProjectRelatedAssetComponent extends DocumentCreativeProjectMgtBaseComponent {

  constructor(
    protected documentPageService: DocumentPageService,
    protected componentFactoryResolver: ComponentFactoryResolver) {
    super(documentPageService, componentFactoryResolver);
  }

  static readonly NAME: string = 'creative-project-related-asset';

  loading: boolean = true;

  layout: string;

  isPackage: boolean = false;

  selectedRows: any = [];

  listViewSettings: any;

  packageViewSettings: any;

  formViewSettings: any;

  isRefresh: boolean = true;

  isChecked: boolean = false;

  doc: DocumentModel;

  assetList: DocumentModel[] = [];

  baseParamsSelected$: Subject<any> = new Subject<any>();

  baseParamsLinkBrand$: Subject<any> = new Subject<any>();

  baseParamsLinkProject$: Subject<any> = new Subject<any>();

  baseParamsRelatedAssets$: Subject<any> = new Subject<any>();

  searchFormSelectedSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    schemas: ['dublincore', 'The_Loupe_Main', 'The_Loupe_Delivery', 'The_Loupe_Credits', 'The_Loupe_ProdCredits', 'The_Loupe_Rights'],
    source: 'document-creative-project-asset-selected',
    enableSearchInput: true,
  });

  searchFormLinkBrandSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    schemas: ['dublincore', 'The_Loupe_Main', 'The_Loupe_Delivery', 'The_Loupe_Credits', 'The_Loupe_ProdCredits', 'The_Loupe_Rights'],
    source: 'document-creative-project-link-brand',
    enableSearchInput: true,
  });

  searchFormLinkProjectSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    schemas: ['dublincore', 'The_Loupe_Main', 'The_Loupe_Delivery', 'The_Loupe_Credits', 'The_Loupe_ProdCredits', 'The_Loupe_Rights'],
    source: 'document-creative-project-link-project',
    enableSearchInput: true,
  });

  searchFormRelatedAssetsSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    schemas: ['dublincore', 'The_Loupe_Main', 'The_Loupe_Delivery', 'The_Loupe_Credits', 'The_Loupe_ProdCredits', 'The_Loupe_Rights'],
    source: 'document-creative-project-related-asset',
    enableSearchInput: true,
  });

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
        title: 'Asset Type',
        sort: false,
      },
      date: {
        title: 'Live Date',
        sort: false,
        valuePrepareFunction: (value: any) => {
          return value ? new DatePipe('en-US').transform(value, 'yyyy-MM-dd') : null;
        },
      },
    },
  };

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

  @Input()
  set assetSettings(settings: any) {
    if (settings) {
      this.packageViewSettings = settings;
    }
    if (settings.isChecked) {
      this.isChecked = settings.isChecked;
    }
    if (settings.layout) {
      this.layout = settings.layout;
    }
  }

  @Input()
  set formSettings(settings: any) {
    if (settings) {
      this.formViewSettings = settings;
    }
  }

  @Output() assetSelected: EventEmitter<any> = new EventEmitter<any>();

  @Output() assetAction: EventEmitter<any> = new EventEmitter<any>();

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
      }));
    }
    return items;
  }

  onSelected(row: any): void {
    this.selectedRows = row.selected;
    row.selectedType = this.packageViewSettings.type;
    this.assetSelected.emit(row);
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

  protected buildAssetParams(doc: any): void {
    switch (this.packageViewSettings.type) {
      case 'assetSelected':
        this.baseParamsSelected$.next(this.buildSelectedAssetsParams(doc));
        break;
      case 'linkBrand':
        this.baseParamsLinkBrand$.next(this.buildLinkAssetsBrandParams(doc));
        break;
      case 'linkProject':
        this.baseParamsLinkProject$.next(this.buildLinkAssetsProjectParams(doc));
        break;
      case 'linkRelated':
        this.baseParamsRelatedAssets$.next(this.buildRelatedAssetsParams(doc, doc.getParent('brand')));
        break;
      case 'assetRelatedSelected':
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
}
