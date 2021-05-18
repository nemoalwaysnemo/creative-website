import { Component, Input, EventEmitter, Output } from '@angular/core';
import { DocumentModel, NuxeoApiService, NuxeoAutomations, UserModel } from '@core/api';
import { Subject, of as observableOf, Observable, concat } from 'rxjs';
import { DynamicInputModel, DynamicTextAreaModel, DynamicSuggestionModel, DynamicOptionTagModel, DynamicCheckboxModel } from '@core/custom';
import { DocumentPageService } from '../../../services/document-page.service';
import { GlobalSearchFormSettings } from '../../../global-search-form/global-search-form.interface';
import { GlobalDocumentFormComponent } from '../../../global-document-form/global-document-form.component';
import { GlobalDocumentDialogService } from '../../../global-document-dialog/global-document-dialog.service';
import { DocumentFormEvent, DocumentFormSettings } from '../../../document-form/document-form.interface';
import { SuggestionSettings } from '../../../document-form-extension';
import { ProjectMgtNavigationSettings } from '../../shared/document-creative-project-navigation/document-creative-project-navigation.interface';


@Component({
  selector: 'document-creative-project-asset-package-send',
  styleUrls: ['../../document-creative-project-mgt.component.scss', './document-creative-project-asset-package-send.component.scss'],
  templateUrl: './document-creative-project-asset-package-send.component.html',
})
export class DocumentCreativeProjectAssetPackageSendComponent extends GlobalDocumentFormComponent {

  static readonly NAME: string = 'creative-project-asset-package-form';

  protected documentType: string = 'App-Library-Delivery-Package';

  baseParams$: Subject<any> = new Subject<any>();

  loading: boolean = true;

  selectedRemoveRows: any = [];

  selectedAddRows: any = [];

  assetAction: any;

  listViewSettings: any;

  currentDocument: DocumentModel;

  actionButton: string;

  libraryView: string = 'linkBrand';

  navSettings: ProjectMgtNavigationSettings;

  listViewOptionsPackage: any = {
    hideHeader: false,
    selectMode: 'multi',
    deliverPackage: true,
    showCheckbox: true,
  };

  assetSettingsData: any;

  assetSettingsSelected: any = {
    enabledFilter: true,
    info: 'Remove selected asset from package',
    title: 'Package Content',
    type: 'assetSelected',
    showProject: false,
  };

  assetSettingsRelatedSelected: any = {
    enabledFilter: true,
    info: 'Remove selected asset from package',
    title: 'Package Content',
    type: 'assetRelatedSelected',
    showProject: false,
    source: [],
  };

  assetSettingsRelated: any = {
    enabledFilter: true,
    info: 'Add selected assets to package',
    title: 'Library',
    type: 'linkRelated',
    showProject: false,
    layout: 'bg-gray',
  };

  assetSettingsLinkBrand: any = {
    enabledFilter: true,
    info: 'Add selected assets to package',
    title: 'Library',
    type: 'linkBrand',
    showProject: true,
    layout: 'bg-gray',
  };

  assetSettingsLinkProjcet: any = {
    enabledFilter: true,
    info: 'Add selected assets to package',
    title: 'Library',
    type: 'linkProject',
    showProject: true,
    layout: 'bg-gray',
  };

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    schemas: ['dublincore', 'The_Loupe_Main', 'The_Loupe_Delivery', 'The_Loupe_Credits', 'The_Loupe_ProdCredits', 'The_Loupe_Rights'],
    source: 'document-creative-project-related-asset',
    enableSearchInput: false,
  });

  @Input()
  set assetData(data: any) {
    if (data) {
      this.assetSettingsRelatedSelected = Object.assign({}, this.assetSettingsRelatedSelected, data);
    }
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
    if (this.actionButton === 'Send' || this.assetAction === 'Resend') {
      const subscription = concat(
        this.removeFromCollection(doc),
        this.addToCollection(doc),
        this.sendPackage(doc),
      ).subscribe();
      this.subscription.add(subscription);
    } else {
      const subscription = concat(
        this.removeFromCollection(doc),
        this.addToCollection(doc),
      ).subscribe();
      this.subscription.add(subscription);
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

  protected beforeOnCallback(event: DocumentFormEvent): Observable<DocumentFormEvent> {
    this.actionButton = event.button;
    return observableOf(event);
  }

  protected beforeOnCreation(doc: DocumentModel, user: UserModel, formSettings: DocumentFormSettings): Observable<DocumentModel> {
    this.currentDocument = doc;
    return this.initializeDocument(doc, this.getDocType());
  }

  protected beforeOnEdit(doc: DocumentModel, user: UserModel, formSettings: DocumentFormSettings): Observable<DocumentModel> {
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
      new DynamicOptionTagModel({
        id: 'The_Loupe_Delivery:slingshot_delivery_email',
        label: 'To',
        required: true,
        placeholder: 'To',
        validators: {
          required: null,
        },
        errorMessages: {
          required: '{{label}} is required',
        },
      }),
      new DynamicCheckboxModel({
        id: 'The_Loupe_Delivery:bcc_myself',
        label: 'CC Myself',
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
        id: 'The_Loupe_Delivery:delivery_option',
        label: 'Delivery Options',
        settings: {
          placeholder: 'Delivery Options',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'App-Library-Delivery-Option',
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
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Delivery:authorization_option',
        label: 'Authorization Options',
        settings: {
          placeholder: 'Authorization Options',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'App-Library-Delivery-Authorization',
        },
      }),
    ];
  }

  onAssetSelected(row: any): void {
    if (row.selectedType === 'assetSelected') {
      this.selectedRemoveRows = row.selected;
    } else {
      this.selectedAddRows = row.selected;
    }
  }

  onAssetAction(data: any): void {
    this.assetAction = data.act;
    if (this.assetAction === 'changeProject') {
      this.libraryView = 'linkProject';
      this.assetSettingsLinkProjcet = {
        enabledFilter: true,
        info: 'Add selected assets to package',
        title: 'Library',
        type: 'linkProject',
        showProject: true,
        action: 'changeProject',
        isChecked: true,
      };
    } else if (this.assetAction === 'changeBrand') {
      this.libraryView = 'linkBrand';
      this.assetSettingsLinkBrand = {
        enabledFilter: true,
        info: 'Add selected assets to package',
        title: 'Library',
        type: 'linkBrand',
        showProject: true,
        action: 'changeBrand',
        isChecked: false,
      };
    }
  }

  protected addToCollection(packageDoc: DocumentModel): Observable<any> {
    const packageId = packageDoc.uid;
    const assetIds: string[] = this.selectedAddRows.map((doc: DocumentModel) => doc.uid);
    if (assetIds.length > 0) {
      return this.nuxeoApi.operation(NuxeoAutomations.AddToCollection, { collection: packageId }, assetIds);
    } else {
      return observableOf(true);
    }
  }

  protected removeFromCollection(packageDoc: DocumentModel): Observable<any> {
    const packageId = packageDoc.uid;
    const assetIds: string[] = this.selectedRemoveRows.map((doc: DocumentModel) => doc.uid);
    if (assetIds.length > 0) {
      return this.nuxeoApi.operation(NuxeoAutomations.RemoveDocumentsFromCollection, { collection: packageId }, assetIds);
    } else {
      return observableOf(true);
    }
  }

  protected sendPackage(packageDoc: any): Observable<any> {
    const packageId = packageDoc.uid;
    return this.nuxeoApi.operation(NuxeoAutomations.SendDeliveryPackage, { uuid: packageId });
  }
}
