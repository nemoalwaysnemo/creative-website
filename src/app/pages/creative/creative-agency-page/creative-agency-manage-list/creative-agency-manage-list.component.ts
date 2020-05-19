import { Component } from '@angular/core';
import { AdvanceSearch, DocumentModel } from '@core/api';
import { ActivatedRoute, Router } from '@angular/router';
import { TAB_CONFIG } from '../creative-agency-tab-config';
import { AbstractDocumentManageComponent, SearchQueryParamsService } from '@pages/shared';
import { DynamicSuggestionModel, DynamicInputModel, DynamicOptionTagModel, DynamicDragDropFileZoneModel, DynamicBatchUploadModel, DynamicCheckboxModel } from '@core/custom';
import { SuggestionSettings } from '@pages/shared/directory-suggestion/directory-suggestion-settings';
import { NbToastrService } from '@core/nebular/theme';
import { DocumentFormEvent } from '@pages/shared/document-form/document-form.interface';

@Component({
  selector: 'creative-agency-manage-list',
  styleUrls: ['./creative-agency-manage-list.component.scss'],
  templateUrl: './creative-agency-manage-list.component.html',
})
export class CreativeAgencyManageListComponent extends AbstractDocumentManageComponent {

  protected tabConfig: any[] = TAB_CONFIG;

  showForm: boolean = false;

  redirectUrl: string = this.router.url;

  constructor(
    private router: Router,
    protected advanceSearch: AdvanceSearch,
    protected activatedRoute: ActivatedRoute,
    protected queryParamsService: SearchQueryParamsService,
    private toastrService: NbToastrService,
  ) {
    super(advanceSearch, activatedRoute, queryParamsService);
  }

  changeView() {
    this.showForm = !this.showForm;
  }

  canceleForm(): void {
    this.changeView();
  }

  updateForm(doc: any): void {
    this.toastrService.success('success', `${doc.title} update success`);
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
          placeholder: 'Select a value',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'GLOBAL_Industries',
        },
      }),
      new DynamicOptionTagModel<string>({
        id: 'The_Loupe_Main:region',
        label: 'Regions',
        placeholder: 'Select a value',
        required: false,
        visibleFn: (doc: DocumentModel): boolean => doc.get('app_global_fields:enable_region'),
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:library_librarians',
        label: 'Librarians',
        settings: {
          initSearch: false,
          placeholder: 'Select a value',
          providerType: SuggestionSettings.USER_GROUP,
        },
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:library_owners',
        label: 'Library Owners',
        settings: {
          initSearch: false,
          placeholder: 'Select a value',
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
          placeholder: 'Select a value',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'App-Library-MediaTypes-Image',
        },
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:assettypes_video',
        label: 'Video Asset Types',
        settings: {
          placeholder: 'Select a value',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'App-Library-MediaTypes-Video',
        },
      }),
      new DynamicSuggestionModel<string>({
        id: 'The_Loupe_Main:assettypes_audio',
        label: 'Audio Asset Types',
        settings: {
          placeholder: 'Select a value',
          providerType: SuggestionSettings.DIRECTORY,
          providerName: 'App-Library-MediaTypes-Audio',
        },
      }),
      new DynamicOptionTagModel<string>({
        id: 'The_Loupe_Main:productModel',
        label: 'Products',
        placeholder: 'Please add product',
        required: false,
        visibleFn: (doc: DocumentModel): boolean => doc.get('app_global_fields:enable_productlist'),
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
    ];
  }
}