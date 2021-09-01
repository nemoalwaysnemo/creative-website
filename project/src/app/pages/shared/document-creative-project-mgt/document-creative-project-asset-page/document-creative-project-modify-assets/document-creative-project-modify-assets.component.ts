import { Component, ComponentFactoryResolver } from '@angular/core';
import { DocumentModel, UserModel } from '@core/api';
import { DynamicSuggestionModel, DynamicDatepickerDirectiveModel } from '@core/custom';
import { DocumentCreativeProjectMgtBaseComponent } from '../../document-creative-project-mgt-base.component';
import { DocumentFormEvent, DocumentFormSettings } from '../../../document-form/document-form.interface';
import { GlobalDocumentDialogService } from '../../../global-document-dialog/global-document-dialog.service';
import { DocumentListViewService } from '../../../document-list-view/document-list-view.service';
import { CreativeProjectMgtSettings } from '../../document-creative-project-mgt.interface';
import { DocumentPageService } from '../../../services/document-page.service';
import { OptionModel } from '../../../option-select/option-select.interface';
import { SuggestionSettings } from '../../../document-form-extension';
import { of as observableOf, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'document-creative-project-modify-assets',
  styleUrls: ['../../document-creative-project-mgt.component.scss'],
  templateUrl: './document-creative-project-modify-assets.component.html',
})
export class DocumentCreativeProjectModifyAssetsComponent extends DocumentCreativeProjectMgtBaseComponent {

  batchDocuments: DocumentModel[];

  brand: DocumentModel;

  batchOperationSettings: DocumentFormSettings = new DocumentFormSettings({
    formMode: 'edit',
    enableBulkImport: false,
    formModel: [
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:assettype',
        label: 'New Asset Type',
        document: true,
        settings: {
          multiple: false,
          placeholder: 'What is this asset?',
          providerType: SuggestionSettings.OPERATION,
          providerName: 'javascript.provideAssetType_Image',
        },
        validators: { required: null },
        errorMessages: { required: '' },
        onResponse: (res: any) => res && res.map((entry: any) => new OptionModel({ label: entry.displayLabel, value: entry.id })),
      }),
      new DynamicDatepickerDirectiveModel<string>({
        id: 'The_Loupe_Rights:first-airing',
        label: 'New First Airing',
        readonly: false,
        validators: {
          dateFormatValidator: null,
        },
        errorMessages: {
          dateFormatValidator: 'Invalid {{label}}. Valid Format MMM D, YYYY',
        },
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Rights:contract_mediatypes',
        label: 'New Media Usage Types',
        document: true,
        settings: {
          placeholder: 'Where is this used?',
          providerType: SuggestionSettings.OPERATION,
          providerName: 'javascript.provideURmediatypes',
        },
        validators: { required: null },
        errorMessages: { required: '' },
        onResponse: (res: any) => res && res.map((entry: any) => new OptionModel({ label: entry.displayLabel, value: entry.id })),
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Rights:asset_countries',
        label: 'New Asset Country',
        settings: {
          placeholder: 'Leave blank to copy from agency\\brand',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'GLOBAL_Countries',
        },
      }),
    ],
  });

  constructor(
    protected documentPageService: DocumentPageService,
    protected componentFactoryResolver: ComponentFactoryResolver,
    protected globalDocumentDialogService: GlobalDocumentDialogService,
    private documentListViewService: DocumentListViewService,
  ) {
    super(documentPageService, componentFactoryResolver, globalDocumentDialogService);
  }

  protected onInit(){
    super.onInit();
    this.documentListViewService.onRowSelected('document-creative-project-asset').pipe(
      map(e => e.selected.map(i => i.action)),
    ).subscribe(batchDocuments => {
      this.setBatchDocuments(batchDocuments);
    });
  }

  protected beforeSetDocument(doc: DocumentModel, user: UserModel, formSettings: CreativeProjectMgtSettings): Observable<DocumentModel> {
    this.setBatchDocuments(formSettings.batchDocuments, formSettings.brand);
    return observableOf(doc);
  }

  private setBatchDocuments(batchDocuments: DocumentModel[], brand?: DocumentModel): void{
    this.brand = brand ? brand : this.brand;
    this.batchDocuments = batchDocuments;
    this.batchDocuments.forEach((item) => {
      item.setParent(this.brand);
    },
    );
  }

  onCallback(event: DocumentFormEvent): void {
    if (event.action === 'Updated' || event.action === 'Canceled') {
      this.triggerChangeView('asset-home-view', 'view', new CreativeProjectMgtSettings({
        mainViewChanged: true,
        document: this.templateSettings.project,
        homeTemplate: 'creative-project-mgt-template',
        homePage: 'asset-page',
        homeView: 'asset-home-view',
      }));
    }
  }
}
