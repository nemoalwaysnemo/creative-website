import { Component, Input, EventEmitter, Output } from '@angular/core';
import { DocumentModel, NuxeoApiService, NuxeoAutomations, UserModel } from '@core/api';
import { Subject, timer, Observable, of as observableOf } from 'rxjs';
import { DynamicInputModel, DynamicTextAreaModel } from '@core/custom';
import { DocumentPageService } from '../../services/document-page.service';
import { GlobalSearchFormSettings } from '../../global-search-form/global-search-form.interface';
import { GlobalDocumentFormComponent } from '../../global-document-form/global-document-form.component';
import { GlobalDocumentDialogService } from '../../global-document-dialog/global-document-dialog.service';
import { DocumentFormEvent, DocumentFormSettings, DocumentFormStatus } from '../../document-form/document-form.interface';

@Component({
  selector: 'document-creative-project-asset-package',
  styleUrls: ['../document-creative-project-mgt.component.scss'],
  templateUrl: './document-creative-project-asset-package.component.html',
})
export class DocumentCreativeProjectAssetPackageComponent extends GlobalDocumentFormComponent {

  static readonly NAME: string = 'creative-project-asset-package-form';

  protected documentType: string = 'App-Library-Delivery-Package';

  baseParams$: Subject<any> = new Subject<any>();

  loading: boolean = true;

  enableButtons: boolean = true;

  isPackage: boolean = false;

  selectedRows: any = [];

  listViewSettings: any;

  isRefresh: boolean = false;

  parentDocument: DocumentModel;

  listViewOptionsPackage: any = {
    hideHeader: true,
    selectMode: 'multi',
    deliverPackage: true,
  };

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    schemas: ['dublincore', 'The_Loupe_Main', 'The_Loupe_Delivery', 'The_Loupe_Credits', 'The_Loupe_ProdCredits', 'The_Loupe_Rights'],
    source: 'document-creative-project-related-asset',
    enableSearchInput: false,
  });

  @Input()
  set showButton(enableButtons: boolean) {
    this.enableButtons = enableButtons;
    this.setFormSettings({ enableButtons });
  }

  @Input()
  set listViewOptions(settings: any) {
    this.listViewOptionsPackage = settings;
  }

  @Output() onResponsed: EventEmitter<any> = new EventEmitter<any>();

  beforeSave: (doc: DocumentModel, user: UserModel) => DocumentModel = (doc: DocumentModel, user: UserModel) => {
    doc.properties['dc:title'] = 'Package-' + doc.getParent().get('The_Loupe_Main:jobnumber');
    doc.properties['The_Loupe_Main:jobtitle'] = [doc.getParent().uid];
    doc.properties['The_Loupe_Delivery:agency_disclaimer'] = doc.getParent().uid;
    return doc;
  }

  afterSave: (doc: DocumentModel, user: UserModel) => Observable<DocumentModel> = (doc: DocumentModel, user: UserModel) => {
    this.addToCollection(doc);
    return observableOf(doc);
  }

  constructor(
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    protected documentPageService: DocumentPageService,
    protected nuxeoApi: NuxeoApiService,
  ) {
    super(documentPageService);
  }

  setFormDocument(doc: DocumentModel, user: UserModel, formSettings: DocumentFormSettings): void {
    super.setFormDocument(doc, user, formSettings);
    this.loading = false;
    this.getStatus(doc);
  }

  protected beforeOnCallback(event: DocumentFormEvent): DocumentFormEvent {
    return event;
  }

  protected beforeOnCreation(doc: DocumentModel): Observable<DocumentModel> {
    this.parentDocument = doc;
    return this.initializeDocument(doc, this.getDocType());
  }

  protected beforeOnEdit(doc: DocumentModel): Observable<DocumentModel> {
    this.parentDocument = doc;
    return observableOf(doc);
  }

  protected getFormSettings(): any {
    return {
      buttonGroup: [
        {
          label: 'Save',
          name: 'save',
          type: 'save',
        },
        {
          label: 'Test',
          name: 'test button',
          type: 'custom',
          disabled: (status: DocumentFormStatus) => false,
          // disabled: (status: DocumentFormStatus) => status.disableSaveButton(),
        },
        {
          label: 'Cancel',
          name: 'cancle',
          type: 'cancle',
        },
      ],
    };
  }

  protected getFormModels(): any[] {
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
      this.nuxeoApi.operation(NuxeoAutomations.AddToCollection, { collection: packageId }, assetIds).subscribe(() => {
        this.refresh();
      });
    } else {
      this.refresh();
    }
  }

  protected refresh(): void {
    this.globalDocumentDialogService.triggerEvent({ name: `Delivery Package`, type: 'callback', messageType: 'success', messageContent: 'Delivery Package has been created successfully!' });
    timer(3000).subscribe(() => {
      this.globalDocumentDialogService.triggerEvent({ name: `Delivery Package`, type: 'callback' });
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
