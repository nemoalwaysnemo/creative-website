import { Component, EventEmitter, Output } from '@angular/core';
import { DocumentModel, NuxeoAutomations, UserModel } from '@core/api';
import { Subject, of as observableOf, Observable, concat, timer } from 'rxjs';
import { DynamicInputModel, DynamicTextAreaModel, DynamicSuggestionModel, DynamicOptionTagModel, DynamicCheckboxModel } from '@core/custom';
import { DocumentPageService, GlobalEvent } from '../../../services/document-page.service';
import { GlobalDocumentFormComponent } from '../../../global-document-form/global-document-form.component';
import { DocumentFormContext, DocumentFormSettings, DocumentFormStatus } from '../../../document-form/document-form.interface';
import { SuggestionSettings } from '../../../document-form-extension';
import { CreativeProjectMgtSettings } from '../../document-creative-project-mgt.interface';
import { map } from 'rxjs/operators';
import { GlobalSearchFormSettings } from '../../../../shared/global-search-form/global-search-form.interface';


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

  formSettings: any = {
    formMode: 'create',
    showMessageBeforeSave: false,
    buttonGroup: [
      {
        label: 'Send',
        name: 'Send',
        type: 'custom',
        disabled: (status: DocumentFormStatus) => status.submitted || !status.formValid,
        triggerSave: true,
      },
      {
        label: 'Save draft',
        name: 'Save draft',
        type: 'save',
      },
    ],
  };

  libraryView: string = 'linkBrand';

  listViewOptionsPackage: any = {
    hideHeader: false,
    selectMode: 'multi',
    showCheckbox: true,
  };

  assetSettingsData: any;

  assetSettingsSelected: any = {
    enabledFilter: true,
    info: 'Remove selected asset from package',
    title: 'Package Content',
    type: 'assetSelected',
  };

  assetSettingsRelatedSelected: any = {
    enabledFilter: true,
    info: 'Remove selected asset from package',
    title: 'Package Content',
    type: 'assetRelatedSelected',
    source: [],
  };

  assetSettingsRelated: any = {
    enabledFilter: true,
    info: 'Add selected assets to package',
    title: 'Library',
    type: 'linkRelated',
    layout: 'bg-gray',
  };

  assetSettingsLinkBrand: any = {
    enabledFilter: true,
    info: 'Add selected assets to package',
    title: 'Library',
    type: 'linkBrand',
    showBrand: true,
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

  @Output() onResponse: EventEmitter<any> = new EventEmitter<any>();

  beforeSave: (doc: DocumentModel, ctx: DocumentFormContext) => Observable<DocumentModel> = (doc: DocumentModel, ctx: DocumentFormContext) => {
    if (this.formSettings.formMode === 'create') {
      doc.setProperty('dc:title', 'Package-' + doc.getParent().get('The_Loupe_Main:jobnumber'));
      doc.setProperty('The_Loupe_Main:jobtitle', [doc.getParent().uid]);
      doc.setProperty('The_Loupe_Delivery:agency_disclaimer', doc.getParent().uid);
    }
    return observableOf(doc);
  }

  afterSave: (doc: DocumentModel, ctx: DocumentFormContext) => Observable<DocumentModel> = (doc: DocumentModel, ctx: DocumentFormContext) => {
    this.actionButton = ctx.action.button ? ctx.action.button : null;
    if (this.actionButton === 'Send' || this.actionButton === 'Resend') {
      const subscription = concat(
        this.removeFromCollection(doc),
        this.addToCollection(doc),
        this.sendPackage(doc).pipe(map((res: any) => {
          this.showMsg(doc);
          this.goHome();
        })),
      ).subscribe();
      this.subscription.add(subscription);
    } else {
      const subscription = concat(
        this.removeFromCollection(doc),
        this.addToCollection(doc).pipe(map((res: any) => {
          this.showMsg(doc);
          this.goHome();
        })),
      ).subscribe();
      this.subscription.add(subscription);
    }
    return observableOf(doc);
  }

  constructor(
    protected documentPageService: DocumentPageService,
  ) {
    super(documentPageService);
    this.subscribeEvents();
  }

  setFormDocument(doc: DocumentModel, user: UserModel, formSettings: DocumentFormSettings): void {
    super.setFormDocument(doc, user, formSettings);
    this.currentUser = user;
    this.loading = false;
  }

  protected onInit(): void {
    this.setFormSettings(this.formSettings);
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
          displayLabel: true,
          multiple: false,
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
          displayLabel: true,
          multiple: false,
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
        showBrand: true,
        action: 'changeBrand',
        isChecked: false,
      };
    }
  }

  subscribeCollection(settings: any): void {
    if (settings) {
      if (['linkProject', 'linkBrand'].includes(settings.name)) {
        if (this.selectedAddRows.length > 0) {
          const subscription = this.addToCollection(this.currentDocument).subscribe((res: any) => {
            if (settings.name === 'linkBrand') {
              timer(500).subscribe(() => { this.searchFormLinkBrandSettings = Object.assign({}, this.searchFormLinkBrandSettings); });
            } else {
              timer(500).subscribe(() => { this.searchFormLinkProjectSettings = Object.assign({}, this.searchFormLinkProjectSettings); });
            }
            timer(1000).subscribe(() => { this.searchFormSelectedSettings = Object.assign({}, this.searchFormSelectedSettings); });
            this.selectedAddRows = [];
          });
          this.subscription.add(subscription);
        }
      } else {
        if (this.selectedRemoveRows.length > 0) {
          const subscription = this.removeFromCollection(this.currentDocument).subscribe((res: any) => {
            if (this.libraryView === 'linkBrand') {
              timer(500).subscribe(() => { this.searchFormLinkBrandSettings = Object.assign({}, this.searchFormLinkBrandSettings); });
            } else {
              timer(500).subscribe(() => { this.searchFormLinkProjectSettings = Object.assign({}, this.searchFormLinkProjectSettings); });
            }
            timer(1000).subscribe(() => { this.searchFormSelectedSettings = Object.assign({}, this.searchFormSelectedSettings); });
            this.selectedRemoveRows = [];
          });
          this.subscription.add(subscription);
        }
      }
    }
  }

  goHome(): void {
    const settings = new CreativeProjectMgtSettings();
    this.documentPageService.triggerEvent(new GlobalEvent({ name: 'SelectedComponentChanged', data: { view: 'package-home-view', type: 'view', settings }, type: 'creative-campaign-project-mgt' }));
  }

  protected addToCollection(packageDoc: DocumentModel): Observable<any> {
    const packageId = packageDoc.uid;
    const assetIds: string[] = this.selectedAddRows.map((doc: DocumentModel) => doc.uid);
    if (assetIds.length > 0) {
      return this.documentPageService.operation(NuxeoAutomations.AddToCollection, { collection: packageId }, assetIds);
    } else {
      return observableOf(true);
    }
  }

  protected removeFromCollection(packageDoc: DocumentModel): Observable<any> {
    const packageId = packageDoc.uid;
    const assetIds: string[] = this.selectedRemoveRows.map((doc: DocumentModel) => doc.uid);
    if (assetIds.length > 0) {
      return this.documentPageService.operation(NuxeoAutomations.RemoveDocumentsFromCollection, { collection: packageId }, assetIds);
    } else {
      return observableOf(true);
    }
  }

  protected sendPackage(packageDoc: any): Observable<any> {
    const packageId = packageDoc.uid;
    return this.documentPageService.operation(NuxeoAutomations.SendDeliveryPackage, { uuid: packageId });
  }

  protected showMsg(doc: DocumentModel): void {
    const action = this.actionButton.toLowerCase();
    this.documentPageService.notify(`${doc.title} has been ${action} successfully!`, '', 'success');
  }

  private subscribeEvents(): void {
    const subscription = this.documentPageService.onEventType('mgt-delivery-package').subscribe((e: GlobalEvent) => {
      this.subscribeCollection(e);
    });
    this.subscription.add(subscription);
  }
}
