import { Component, Input, EventEmitter, Output } from '@angular/core';
import { DocumentModel, NuxeoApiService, NuxeoAutomations, UserModel } from '@core/api';
import { Subject, timer, Observable, of as observableOf } from 'rxjs';
import { DynamicInputModel, DynamicTextAreaModel } from '@core/custom';
import { DocumentPageService } from '../../services/document-page.service';
import { GlobalSearchFormSettings } from '../../global-search-form/global-search-form.interface';
import { GlobalDocumentFormComponent } from '../../global-document-form/global-document-form.component';
import { GlobalDocumentDialogService } from '../../global-document-dialog/global-document-dialog.service';

@Component({
  selector: 'document-creative-project-asset-package',
  styleUrls: ['../document-creative-project-mgt.component.scss'],
  templateUrl: './document-creative-project-asset-package.component.html',
})
export class DocumentCreativeProjectAssetPackageComponent extends GlobalDocumentFormComponent {

  static readonly NAME: string = 'creative-project-asset-package-form';

  protected documentType: string = 'App-Library-Delivery-Package';

  loading: boolean = true;

  baseParams$: Subject<any> = new Subject<any>();

  isPackage: boolean = false;

  selectedRows: any = [];

  listViewSettings: any;

  isRefresh: boolean = false;

  parentDocument: DocumentModel;

  showStatus: boolean = true;

  listViewOptionsPackage: any = {
    hideHeader: false,
    selectMode: 'multi',
    deliverPackage: true,
  };

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

  setFormDocument(doc: DocumentModel, user: UserModel): void {
    super.setFormDocument(doc, user);
    this.loading = false;
    this.getStatus(doc);
  }

  @Input()
  set showButton(show: boolean) {
    this.showStatus = show;
  }

  @Input()
  set listViewOptions(settings: any) {
    this.listViewOptionsPackage = settings;
  }

  @Output() onResponsed: EventEmitter<any> = new EventEmitter<any>();

  protected beforeOnCreation(doc: DocumentModel): Observable<DocumentModel> {
    this.parentDocument = doc;
    return this.initializeDocument(doc, this.getDocType());
  }

  protected beforeOnEdit(doc: DocumentModel): Observable<DocumentModel> {
    this.parentDocument = doc;
    return observableOf(doc);
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
        formMode: 'create',
      }),
      new DynamicInputModel({
        id: 'The_Loupe_Delivery:delivery_email',
        label: 'To',
        placeholder: 'To',
        autoComplete: 'off',
        required: false,
        readOnly: true,
        disabled: true,
        formMode: 'edit',
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
      // new DynamicSuggestionModel<string>({
      //   id: 'The_Loupe_Delivery:expiry_days',
      //   label: 'Expies in (days)',
      //   required: false,
      //   settings: {
      //     multiple: false,
      //     placeholder: 'Expies in (days)',
      //     providerType: SuggestionSettings.DIRECTORY,
      //     providerName: 'App-Library-Delivery-expiry-days',
      //   },
      //   formMode: 'create',
      // }),
      // new DynamicSuggestionModel<string>({
      //   id: 'The_Loupe_Delivery:delivery_config',
      //   label: 'Delivery Options',
      //   required: false,
      //   settings: {
      //     placeholder: 'Delivery Options',
      //     providerType: SuggestionSettings.DIRECTORY,
      //     providerName: 'App-Library-Delivery-Config',
      //   },
      //   formMode: 'create',
      // }),
      // new DynamicSuggestionModel<string>({
      //   id: 'The_Loupe_Delivery:delivery_config',
      //   label: 'Delivery Options',
      //   settings: {
      //     placeholder: 'Delivery Options',
      //     providerType: SuggestionSettings.DIRECTORY,
      //     providerName: 'App-Library-Delivery-Config',
      //   },
      //   readOnly: true,
      //   disabled: true,
      //   formMode: 'edit',
      // }),
      // new DynamicSuggestionModel<string>({
      //   id: 'The_Loupe_Delivery:expiry_days',
      //   label: 'Expires  in (days)',
      //   settings: {
      //     multiple: false,
      //     placeholder: 'Expires',
      //     providerType: SuggestionSettings.DIRECTORY,
      //     providerName: 'App-Library-Delivery-expiry-days',
      //   },
      //   formMode: 'edit',
      // }),
      new DynamicInputModel({
        id: 'The_Loupe_Delivery:delivery_expiration_date',
        // inputType: 'date',
        label: 'Expires',
        readOnly: true,
        disabled: true,
        formMode: 'edit',
      }),
      // new DynamicInputModel({
      //   id: 'The_Loupe_Delivery:status',
      //   label: 'Status',
      //   readOnly: true,
      //   disabled: true,
      //   formMode: 'edit',
      // }),
      new DynamicInputModel({
        id: 'The_Loupe_Delivery:delivery_downloaded_date',
        label: 'Delivered',
        readOnly: true,
        disabled: true,
        formMode: 'edit',
      }),
      new DynamicInputModel({
        id: 'The_Loupe_Delivery:delivery_send_date',
        label: 'Downloaded',
        readOnly: true,
        disabled: true,
        formMode: 'edit',
      }),
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
        formMode: 'create',
      }),
      new DynamicTextAreaModel({
        id: 'The_Loupe_Main:comment',
        label: 'Personal Message',
        rows: 3,
        required: false,
        validators: {
          required: null,
          minLength: 4,
        },
        errorMessages: {
          required: '{{label}} is required',
          minLength: 'At least 4 characters',
        },
        readOnly: true,
        disabled: true,
        formMode: 'edit',
      }),
    ];
  }

  onSelected(row: any): void {
    this.selectedRows = row.selected;
  }

  protected getStatus(doc: DocumentModel): void {
    const status = doc.get('The_Loupe_Delivery:status');
    if (status) {
      // this.showButton = false;
    }
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
    this.listViewOptionsPackage = {
      hideHeader: false,
      selectMode: 'multi',
      deliverPackage: true,
    };
  }

  protected goBack(): void {
    this.onResponsed.emit('back');
  }
}
