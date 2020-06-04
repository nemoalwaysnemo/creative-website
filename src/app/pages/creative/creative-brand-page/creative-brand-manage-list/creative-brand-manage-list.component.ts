import { Component } from '@angular/core';
import { DocumentModel } from '@core/api';
import { ActivatedRoute } from '@angular/router';
import { TAB_CONFIG } from '../creative-brand-tab-config';
import { BaseDocumentManageComponent, DocumentPageService } from '@pages/shared';
import { DynamicSuggestionModel, DynamicInputModel, DynamicOptionTagModel, DynamicDragDropFileZoneModel, DynamicBatchUploadModel, DynamicCheckboxModel } from '@core/custom';
import { SuggestionSettings } from '../../../shared/directory-suggestion/directory-suggestion-settings';
import { DocumentFormEvent } from '../../../shared/document-form/document-form.interface';

@Component({
  selector: 'creative-brand-manage-list',
  styleUrls: ['./creative-brand-manage-list.component.scss'],
  templateUrl: './creative-brand-manage-list.component.html',
})
export class CreativeBrandManageListComponent extends BaseDocumentManageComponent {

  showForm: boolean = false;

  redirectUrl: string = this.documentPageService.getCurrentUrl();

  protected tabConfig: any[] = TAB_CONFIG;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected documentPageService: DocumentPageService,
  ) {
    super(activatedRoute, documentPageService);
  }

  changeView(): void {
    this.showForm = !this.showForm;
  }

  canceleForm(): void {
    this.changeView();
  }

  updateForm(doc: any): void {
    this.documentPageService.notify(`${doc.title} has been updated successfully!`, '', 'success');
  }

  onCallback(callback: DocumentFormEvent): void {
    if (callback.action === 'Updated') {
      this.updateForm(callback.doc);
      this.refresh(this.redirectUrl);
    } else if (callback.action === 'Canceled') {
      this.canceleForm();
    }
  }

  protected getFormLayout(): any {
    return {
      'dc:title': {
        element: {
          container: 'p-0',
          label: 'col-form-label',
        },
        grid: {
          host: 'col-sm-4',
        },
      },
      'The_Loupe_Main:brand': {
        element: {
          container: 'p-0',
          label: 'col-form-label',
        },
        grid: {
          host: 'col-sm-4',
        },
      },
      'app_Edges:industry': {
        element: {
          container: 'p-0',
          label: 'col-form-label',
        },
        grid: {
          host: 'col-sm-4',
        },
      },
      'app_Edges:Relevant_Country': {
        element: {
          container: 'p-0',
          label: 'col-form-label',
        },
        grid: {
          host: 'col-sm-4',
        },
      },
    };
  }

  protected getSettings(): any[] {
    return [
      new DynamicInputModel({
        id: 'dc:title',
        label: 'Title',
        maxLength: 50,
        placeholder: 'Title',
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
      new DynamicDragDropFileZoneModel<string>({
        id: 'dragDropAssetZone',
        formMode: 'edit',
        uploadType: 'asset',
        layoutPosition: 'right',
        queueLimit: 1,
        placeholder: 'Drop Logo/Image here!',
        acceptTypes: 'image/*',
      }),
      new DynamicBatchUploadModel<string>({
        id: 'files:files',
        layoutPosition: 'bottom',
        formMode: 'edit',
        showInputs: false,
        multiUpload: true,
      }),
      new DynamicOptionTagModel({
        id: 'The_Loupe_Main:clientName',
        label: 'Client',
        placeholder: 'Client',
        required: false,
      }),
      new DynamicOptionTagModel({
        id: 'The_Loupe_Main:brand',
        label: 'Brand',
        placeholder: 'Brand',
        required: false,
        visibleFn: (doc: DocumentModel): boolean => doc.get('app_global:brand_activation'),
      }),
      new DynamicSuggestionModel<string>({
        id: 'app_Edges:industry',
        label: 'Industry',
        settings: {
          placeholder: 'Please select industry',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'GLOBAL_Industries',
        },
      }),
      new DynamicOptionTagModel<string>({
        id: 'The_Loupe_Main:region',
        label: 'Regions',
        placeholder: 'Please add region',
        required: false,
        visibleFn: (doc: DocumentModel): boolean => doc.get('app_global_fields:enable_region'),
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:library_librarians',
        label: 'Librarians',
        settings: {
          initSearch: false,
          placeholder: 'Please select librarians',
          providerType: SuggestionSettings.USER_GROUP,
        },
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:library_owners',
        label: 'Library Owners',
        settings: {
          initSearch: false,
          placeholder: 'Please select Library Owners',
          providerType: SuggestionSettings.USER_GROUP,
        },
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Rights:asset_countries',
        label: 'Default Asset Country',
        settings: {
          placeholder: 'Select default country for all new assets in this library.',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'GLOBAL_Countries',
        },
      }),
      new DynamicCheckboxModel({
        id: 'app_global:UsageRights_enable_firstairing_mandatory',
        label: 'Make First Airing Mandatory',
        visibleFn: (doc: DocumentModel): boolean => doc.get('app_global:UsageRights'),
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Rights:contract_mediatypes',
        label: 'Usage Rights Media Usage Types',
        settings: {
          placeholder: 'Media Usage Types available for all assets in this library folder',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'App-Library-UR-contract-mediatypes',
        },
        visibleFn: (doc: DocumentModel): boolean => doc.get('app_global:UsageRights'),
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:assettypes_image',
        label: 'Image Asset Types',
        settings: {
          parentOnly: true,
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'App-Library-MediaTypes-Image',
        },
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:assettypes_video',
        label: 'Video Asset Types',
        settings: {
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'App-Library-MediaTypes-Video',
        },
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:assettypes_audio',
        label: 'Audio Asset Types',
        settings: {
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'App-Library-MediaTypes-Audio',
        },
      }),
      new DynamicOptionTagModel<string>({
        id: 'The_Loupe_Main:productModel',
        label: 'Product',
        placeholder: 'Please add product',
        required: false,
        visibleFn: (doc: DocumentModel): boolean => doc.get('app_global_fields:enable_productlist'),
      }),
    ];
  }
}
