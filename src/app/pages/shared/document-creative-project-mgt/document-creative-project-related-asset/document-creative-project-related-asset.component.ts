import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DocumentModel, NuxeoApiService, UserModel, NuxeoAutomations } from '@core/api';
import { Subject, timer, Observable, of as observableOf } from 'rxjs';
import { ListSearchRowCustomViewComponent } from '../../list-search-form';
import { GlobalDocumentDialogService } from '../../global-document-dialog';
import { ListSearchRowCustomViewSettings } from '../../list-search-form/list-search-form.interface';
import { DocumentListViewItem } from '../../document-list-view/document-list-view.interface';
import { SuggestionSettings } from '../../directory-suggestion/directory-suggestion-settings';
import { GlobalSearchFormSettings } from '../../global-search-form/global-search-form.interface';
import { NUXEO_DOC_TYPE } from '@environment/environment';
import { GlobalDocumentFormComponent } from '../../global-document-form/global-document-form.component';
import { DocumentPageService } from '../../services/document-page.service';
import { DynamicInputModel, DynamicSuggestionModel, DynamicTextAreaModel } from '@core/custom';

@Component({
  selector: 'document-creative-project-related-asset',
  styleUrls: ['../document-creative-project-mgt.component.scss'],
  templateUrl: './document-creative-project-related-asset.component.html',
})
export class DocumentCreativeProjectRelatedAssetComponent extends GlobalDocumentFormComponent {

  static readonly NAME: string = 'document-project-package-template';

  protected documentType: string = 'App-Library-Delivery-Package';

  loading: boolean = true;

  baseParams$: Subject<any> = new Subject<any>();

  isPackage: boolean = false;

  selectedRows: any = [];

  listViewSettings: any;

  isRefresh: boolean = true;

  beforeSave: Function = (doc: DocumentModel, user: UserModel): DocumentModel => {
    doc.properties['dc:title'] = 'Package-' + doc.getParent().get('The_Loupe_Main:jobnumber');
    doc.properties['The_Loupe_Main:jobtitle'] = [doc.getParent().uid];
    doc.properties['The_Loupe_Delivery:agency_disclaimer'] = doc.getParent().uid;
    // doc.properties['dc:subjects'] = [doc.get('dc:subjects')];
    return doc;
  }

  afterSave: Function = (doc: DocumentModel, user: UserModel): Observable<DocumentModel> => {
    this.addToCollection(doc);
    return observableOf(doc);
  }

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    schemas: ['dublincore', 'The_Loupe_Main', 'The_Loupe_Delivery', 'The_Loupe_Credits', 'The_Loupe_ProdCredits', 'The_Loupe_Rights'],
    source: 'document-creative-project-related-asset',
    enableSearchInput: false,
  });

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected documentPageService: DocumentPageService,
    protected nuxeoApi: NuxeoApiService,
  ) {
    super(documentPageService);
  }

  defaultSettings: any = {
    hideHeader: true,
    hideSubHeader: true,
    selectMode: 'single',
    columns: {
      title: {
        title: 'Title',
        sort: false,
      },
      action: {
        title: 'Action',
        sort: false,
        type: 'custom',
        renderComponentData: new ListSearchRowCustomViewSettings({
          viewType: 'thumbnail',
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
        title: doc.title,
        action: doc,
      }));
    }
    return items;
  }

  setFormDocument(doc: DocumentModel, user: UserModel): void {
    super.setFormDocument(doc, user);
    this.loading = false;
    timer(0).subscribe(() => { this.baseParams$.next(this.buildAssetParams(doc, doc.getParent('brand'))); });
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

  @Output() onResponsed: EventEmitter<boolean> = new EventEmitter<boolean>();

  protected beforeOnCreation(doc: DocumentModel): Observable<DocumentModel> {
    return this.initializeDocument(doc, this.getDocType());
  }

  protected getSettings(): object[] {
    return [
      new DynamicInputModel({
        id: 'The_Loupe_Main:brand',
        label: 'Brand',
        hidden: true,
      }),
      new DynamicInputModel({
        id: 'The_Loupe_Delivery:delivery_email',
        label: 'To',
        maxLength: 50,
        placeholder: 'To',
        autoComplete: 'off',
        required: true,
        validators: {
          required: null,
          minLength: 4,
        },
        errorMessages: {
          required: '{{label}} is required',
          minLength: 'At least 4 characters',
        },
      }),
      // new DynamicInputModel({
      //   id: 'dc:subjects',
      //   label: 'Subject',
      //   maxLength: 50,
      //   placeholder: 'Subject',
      //   autoComplete: 'off',
      //   required: true,
      //   validators: {
      //     required: null,
      //     minLength: 4,
      //   },
      //   errorMessages: {
      //     required: '{{label}} is required',
      //     minLength: 'At least 4 characters',
      //   },
      // }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Delivery:delivery_config',
        label: 'Delivery Options',
        settings: {
          placeholder: 'Delivery Options',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'App-Library-Delivery-Config',
        },
        formMode: 'edit',
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Delivery:expiry_days',
        label: '#days until expiry',
        settings: {
          multiple: false,
          placeholder: '#days until expiry',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'App-Library-Delivery-expiry-days',
        },
        formMode: 'edit',
      }),
      // new DynamicInputModel({
      //   id: 'The_Loupe_Delivery:expiry_days',
      //   label: '#days until expiry',
      //   disabled: true,
      //   defaultValue: '3',
      //   formMode: 'create',
      // }),
      // new DynamicInputModel({
      //   id: 'The_Loupe_Delivery:delivery_config',
      //   label: 'Delivery Options',
      //   disabled: true,
      //   defaultValue: 'Only main files',
      //   formMode: 'create',
      // }),
      new DynamicTextAreaModel({
        id: 'The_Loupe_Main:comment',
        label: 'Personal Message',
        rows: 3,
        required: true,
        validators: {
          required: null,
          minLength: 4,
        },
        errorMessages: {
          required: '{{label}} is required',
          minLength: 'At least 4 characters',
        },
      }),
    ];
  }

  onSelected(row: any): void {
    this.selectedRows = row.selected;
  }

  protected addToCollection(packageDoc: DocumentModel): void {
    const packageId = packageDoc.uid;
    const assetIds: string[] = this.selectedRows.map((doc: DocumentModel) => doc.uid);
    if (assetIds.length > 0) {
      this.nuxeoApi.operation(NuxeoAutomations.AddToCollection, { 'collection': packageId }, assetIds).subscribe(() => {
        this.refresh();
      });
    }
  }

  protected refresh(): void {
    this.globalDocumentDialogService.triggerEvent({ name: `Add to Collection`, type: 'callback', messageType: 'success', messageContent: 'Add to Collection has been created successfully!' });
    timer(3000).subscribe(() => {
      this.globalDocumentDialogService.triggerEvent({ name: `Add to Collection`, type: 'callback' });
    });
    this.onResponsed.emit(this.isRefresh);
  }

  protected buildAssetParams(doc: DocumentModel, brand: DocumentModel): any {
    const params = {
      ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_IMAGE_VIDEO_AUDIO_TYPES,
      currentPageIndex: 0,
      pageSize: 20,
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
