import { Component, ComponentFactoryResolver } from '@angular/core';
import { DocumentModel, UserModel } from '@core/api';
import { DocumentCreativeProjectMgtBaseComponent } from '../../document-creative-project-mgt-base.component';
import { CreativeProjectMgtSettings } from '../../document-creative-project-mgt.interface';
import { DocumentPageService } from '../../../services/document-page.service';
import { of as observableOf, Observable } from 'rxjs';
import { DocumentFormEvent, DocumentFormSettings } from '../../../document-form/document-form.interface';
import { DynamicSuggestionModel, DynamicDatepickerDirectiveModel } from '@core/custom';
import { OptionModel } from '../../../option-select/option-select.interface';
import { SuggestionSettings } from '../../../document-form-extension';
@Component({
  selector: 'document-creative-project-modify-assets',
  styleUrls: ['../../document-creative-project-mgt.component.scss'],
  templateUrl: './document-creative-project-modify-assets.component.html',
})
export class DocumentCreativeProjectModifyAssetsComponent extends DocumentCreativeProjectMgtBaseComponent {
  constructor(
    protected documentPageService: DocumentPageService,
    protected componentFactoryResolver: ComponentFactoryResolver,
  ) {
    super(documentPageService, componentFactoryResolver);
  }

  batchDocuments: DocumentModel[];

  batchOperationSettings: DocumentFormSettings = new DocumentFormSettings({
    formMode: 'edit',
    formModel: [
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:assettype',
        label: 'New Asset Type',
        document: true,
        required: true,
        settings: {
          multiple: false,
          placeholder: 'What is this asset?',
          providerType: SuggestionSettings.OPERATION,
          providerName: 'javascript.provideAssetType_Image',
        },
        validators: { required: null },
        errorMessages: { required: '' },
        onResponsed: (res: any) => res && res.map((entry: any) => new OptionModel({ label: entry.displayLabel, value: entry.id })),
      }),
      new DynamicDatepickerDirectiveModel<string>({
        id: 'The_Loupe_Rights:first-airing',
        label: 'New First Airing',
        required: false,
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
        required: true,
        document: true,
        settings: {
          placeholder: 'Where is this used?',
          providerType: SuggestionSettings.OPERATION,
          providerName: 'javascript.provideURmediatypes',
        },
        validators: { required: null },
        errorMessages: { required: '' },
        onResponsed: (res: any) => res && res.map((entry: any) => new OptionModel({ label: entry.displayLabel, value: entry.id })),
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

  protected beforeSetDocument(doc: DocumentModel, user: UserModel, formSettings: CreativeProjectMgtSettings): Observable<DocumentModel> {
    this.batchDocuments = formSettings.batchDocuments;
    this.batchDocuments.forEach((item) => {
      item.setParent(formSettings.brand);
      },
    );
    return observableOf(doc);
  }

  onCallback(event: DocumentFormEvent): void {
    if (event.action === 'Updated' || event.action === 'Canceled') {
      this.triggerChangeView('asset-home-view', 'view', new CreativeProjectMgtSettings({ document: this.templateSettings.project }));
    }
  }
}