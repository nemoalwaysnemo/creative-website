import { Component, Input, EventEmitter, Output } from '@angular/core';
import { DocumentModel, NuxeoApiService, NuxeoAutomations, UserModel } from '@core/api';
import { Subject, timer, Observable, of as observableOf, concat } from 'rxjs';
import { DynamicInputModel, DynamicTextAreaModel, DynamicSuggestionModel } from '@core/custom';
import { DocumentPageService } from '../../services/document-page.service';
import { GlobalSearchFormSettings } from '../../global-search-form/global-search-form.interface';
import { GlobalDocumentFormComponent } from '../../global-document-form/global-document-form.component';
import { GlobalDocumentDialogService } from '../../global-document-dialog/global-document-dialog.service';
import { DocumentFormEvent, DocumentFormSettings, DocumentFormStatus } from '../../document-form/document-form.interface';
import { SuggestionSettings } from '../../document-form-extension';


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

  currentDocument: DocumentModel;

  showStatus: boolean = true;

  actionButton: string;

  listViewOptionsPackage: any = {
    hideHeader: true,
    selectMode: 'multi',
    deliverPackage: true,
    showCheckbox: true,
  };

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    schemas: ['dublincore', 'The_Loupe_Main', 'The_Loupe_Delivery', 'The_Loupe_Credits', 'The_Loupe_ProdCredits', 'The_Loupe_Rights'],
    source: 'document-creative-project-related-asset',
    enableSearchInput: false,
  });

  editSettings: any = {
    resetFormAfterDone: true,
    formMode: 'edit',
    buttonGroup: [
      {
        label: 'Send',
        name: 'send',
        type: 'custom',
        disabled: (status: DocumentFormStatus) => status.submitted || !status.formValid,
        hasSave: true,
      },
      {
        label: 'Save draft',
        name: 'Save draft',
        type: 'save',
      },
    ],
  };

  @Input() showForm: boolean = false;

  @Input()
  set showButton(enableButtons: boolean) {
    this.enableButtons = enableButtons;
  }

  @Input()
  set listViewOptions(settings: any) {
    this.listViewOptionsPackage = settings;
  }

  @Output() onResponsed: EventEmitter<any> = new EventEmitter<any>();

  beforeSave: (doc: DocumentModel, user: UserModel) => DocumentModel = (doc: DocumentModel, user: UserModel) => {
    if (this.formSettings.formMode === 'create') {
      doc.properties['dc:title'] = 'Package-' + doc.getParent().get('The_Loupe_Main:jobnumber');
      doc.properties['The_Loupe_Main:jobtitle'] = [doc.getParent().uid];
      doc.properties['The_Loupe_Delivery:agency_disclaimer'] = doc.getParent().uid;
    }
    return doc;
  }

  afterSave: (doc: DocumentModel, user: UserModel) => Observable<DocumentModel> = (doc: DocumentModel, user: UserModel) => {
    if (this.actionButton === 'send') {
      const subscription = concat(
        this.addToCollection(doc),
        this.sendPackage(doc),
      ).subscribe(() => {
        this.refresh();
      });
      this.subscription.add(subscription);
    } else {
      this.addToCollection(doc).subscribe(() => {
        this.refresh();
      });
    }

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
    this.currentUser = user;
    this.loading = false;
  }

  protected beforeOnCallback(event: DocumentFormEvent): DocumentFormEvent {
    this.actionButton = event.button;
    return event;
  }

  protected beforeOnCreation(doc: DocumentModel): Observable<DocumentModel> {
    this.currentDocument = doc;
    return this.initializeDocument(doc, this.getDocType());
  }

  protected beforeOnEdit(doc: DocumentModel): Observable<DocumentModel> {
    this.currentDocument = doc;
    return observableOf(doc);
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
      }),
      new DynamicInputModel({
        id: 'The_Loupe_Delivery:email_subject',
        label: 'Subject',
        maxLength: 50,
        placeholder: 'Subject',
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
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Delivery:expiry_days',
        label: 'Expires in (days)',
        settings: {
          multiple: false,
          placeholder: 'Expires',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'App-Library-Delivery-expiry-days',
        },
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Delivery:delivery_config',
        label: 'Delivery Options',
        settings: {
          placeholder: 'Delivery Options',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'App-Library-Delivery-Config',
        },
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
      }),
    ];
  }

  changeView(): void {
    this.showForm = !this.showForm;
    if (this.showForm) {
      this.setFormSettings(this.editSettings);
    }
  }

  onAssetSelected(row: any): void {
    this.selectedRows = row.selected;
  }

  protected addToCollection(packageDoc: DocumentModel): Observable<any> {
    const packageId = packageDoc.uid;
    const assetIds: string[] = this.selectedRows.map((doc: DocumentModel) => doc.uid);
    if (assetIds.length > 0) {
      return this.nuxeoApi.operation(NuxeoAutomations.AddToCollection, { collection: packageId }, assetIds);
    } else {
      return observableOf(true);
    }
  }

  protected sendPackage(packageDoc): Observable<any> {
    const packageId = packageDoc.uid;
    return this.nuxeoApi.operation(NuxeoAutomations.sendPackageRequest, { uuid: packageId });
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

    if (!this.enableButtons) {
      this.listViewOptionsPackage.selectMode = 'single';
      this.listViewOptionsPackage.hideHeader = true;
    }
  }

  protected goBack(): void {
    this.onResponsed.emit('back');
  }
}
